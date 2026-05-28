package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.dto.obra.*;
import joaopldantas.project.entities.Obra;
import joaopldantas.project.entities.Usuario;
import joaopldantas.project.entities.enums.Papel;
import joaopldantas.project.entities.enums.StatusObra;
import joaopldantas.project.exceptions.BusinessException;
import joaopldantas.project.repositories.ObraRepository;
import joaopldantas.project.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
public class ObraServiceImpl implements ObraService {

    private final ObraRepository obraRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public ObraServiceImpl(ObraRepository obraRepository,
                           UsuarioRepository usuarioRepository, UsuarioAutenticadoService usuarioAutenticadoService) {
        this.obraRepository = obraRepository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
    }

    @Override
    public ObraResponseDTO criar(CriarObraDTO dto) {

        Usuario responsavel = usuarioRepository.findById(dto.responsavelId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Usuário responsável não encontrado"));

        if (responsavel.getPapel() != Papel.ENGENHEIRO) {
            throw new BusinessException("Responsável deve ser um ENGENHEIRO");
        }

        Obra obra = new Obra();
        obra.setNome(dto.nome());
        obra.setEndereco(dto.endereco());
        obra.setCep(dto.cep());
        obra.setStatus(dto.status());
        obra.setResponsavel(responsavel);

        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO buscarPorId(Long id) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Obra não encontrada"));

        return toResponseDTO(obra);
    }

    @Override
    public List<ObraResponseDTO> listarTodas() {

        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        List<Obra> obras;

        if (usuarioLogado.getPapel() == Papel.ADMIN) {
            obras = obraRepository.findAll();
        } else if (usuarioLogado.getPapel() == Papel.ENGENHEIRO) {
            obras = obraRepository.findByResponsavelId(usuarioLogado.getId());
        } else if (usuarioLogado.getPapel() == Papel.CAMPO) {
            obras = obraRepository.findByUsuariosId(usuarioLogado.getId());
        } else if (usuarioLogado.getPapel() == Papel.BACKOFFICE) {
            obras = obraRepository.findAll();
        } else {
            throw new AccessDeniedException("Sem permissão para visualizar obras");
        }

        return obras.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<ObraResponseDTO> listarPorStatus(StatusObra status) {
        return obraRepository.findByStatus(status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<ObraResponseDTO> listarPorNome(String nome) {
        return obraRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<ObraResponseDTO> listarPorResponsavel(Long usuarioId) {
        return obraRepository.findByResponsavelId(usuarioId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<ObraResponseDTO> listarPorResponsavelEStatus(Long usuarioId, StatusObra status) {
        return obraRepository.findByResponsavelIdAndStatus(usuarioId, status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<ObraResponseDTO> listarPorUsuarioParticipante(Long usuarioId) {
        return obraRepository.findByUsuariosId(usuarioId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<ObraResponseDTO> listarPorUsuarioParticipanteEStatus(Long usuarioId, StatusObra status) {
        return obraRepository.findByUsuariosIdAndStatus(usuarioId, status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public ObraResponseDTO adicionarUsuarioNaObra(Long obraId, Long usuarioId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Obra não encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Usuário não encontrado"));

        if (obra.getUsuarios().contains(usuario)) {
            throw new BusinessException("Usuário já está vinculado a esta obra");
        }

        obra.getUsuarios().add(usuario);
        obraRepository.save(obra);
        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO removerUsuarioDaObra(Long obraId, Long usuarioId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Obra não encontrada"));

        boolean removido = obra.getUsuarios()
                .removeIf(u -> u.getId().equals(usuarioId));

        if (!removido) {
            throw new BusinessException("Usuário não está vinculado a esta obra");
        }

        obraRepository.save(obra);
        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO atualizarStatus(Long obraId, AtualizarStatusObraDTO dto) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Obra não encontrada"));

        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        if (usuarioLogado.getPapel() != Papel.ADMIN) {

            if (usuarioLogado.getPapel() != Papel.ENGENHEIRO ||
                    !obra.getResponsavel().getId().equals(usuarioLogado.getId())) {

                throw new AccessDeniedException(
                        "Somente o engenheiro responsável pode alterar o status"
                );
            }
        }

        if (!obra.getStatus().podeIrPara(dto.status())) {
            throw new BusinessException(
                    "Transição inválida de " +
                            obra.getStatus() + " para " + dto.status());
        }

        obra.setStatus(dto.status());
        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO atualizar(Long obraId, AtualizarObraDTO dto) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Obra não encontrada"));

        if (dto.nome() != null) obra.setNome(dto.nome());
        if (dto.endereco() != null) obra.setEndereco(dto.endereco());
        if (dto.cep() != null) obra.setCep(dto.cep());
        if (dto.status() != null) obra.setStatus(dto.status());

        if (dto.responsavelId() != null) {
            Usuario responsavel = usuarioRepository.findById(dto.responsavelId())
                    .orElseThrow(() ->
                            new EntityNotFoundException("Usuário responsável não encontrado"));
            obra.setResponsavel(responsavel);
        }

        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public void deletarObra(Long obraId) {

        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        if (usuarioLogado.getPapel() != Papel.ADMIN) {
            throw new AccessDeniedException(
                    "Somente ADMIN pode deletar obra"
            );
        }

        obraRepository.delete(obra);
    }

    @Override
    public boolean existePorId(Long obraId) {
        return obraRepository.existsById(obraId);
    }

    private ObraResponseDTO toResponseDTO(Obra obra) {
        return new ObraResponseDTO(
                obra.getId(),
                obra.getNome(),
                obra.getEndereco(),
                obra.getCep(),
                obra.getStatus(),
                obra.getResponsavel() != null
                        ? obra.getResponsavel().getId()
                        : null
        );
    }
}
