package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.dto.obra.*;
import joaopldantas.project.entities.Obra;
import joaopldantas.project.entities.Usuario;
import joaopldantas.project.entities.enums.StatusObra;
import joaopldantas.project.repositories.ObraRepository;
import joaopldantas.project.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ObraServiceImpl implements ObraService {

    private final ObraRepository obraRepository;
    private final UsuarioRepository usuarioRepository;

    public ObraServiceImpl(ObraRepository obraRepository,
                           UsuarioRepository usuarioRepository) {
        this.obraRepository = obraRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public ObraResponseDTO criar(CriarObraDTO dto) {

        Usuario responsavel = usuarioRepository.findById(dto.responsavelId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário responsável não encontrado"));

        Obra obra = new Obra();
        obra.setNome(dto.nome());
        obra.setEndereco(dto.endereco());
        obra.setStatus(dto.status());
        obra.setResponsavel(responsavel);

        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO buscarPorId(Long id) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));
        return toResponseDTO(obra);
    }

    @Override
    public List<ObraResponseDTO> listarTodas() {
        return obraRepository.findAll()
                .stream()
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
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        obra.getUsuarios().add(usuario);

        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO removerUsuarioDaObra(Long obraId, Long usuarioId) {

        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        obra.getUsuarios().removeIf(u -> u.getId().equals(usuarioId));

        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO atualizarStatus(Long obraId, AtualizarStatusObraDTO dto) {

        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        obra.setStatus(dto.status());

        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public ObraResponseDTO atualizar(Long obraId, AtualizarObraDTO dto) {

        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        if (dto.nome() != null) obra.setNome(dto.nome());
        if (dto.endereco() != null) obra.setEndereco(dto.endereco());
        if (dto.status() != null) obra.setStatus(dto.status());

        if (dto.responsavelId() != null) {
            Usuario responsavel = usuarioRepository.findById(dto.responsavelId())
                    .orElseThrow(() -> new EntityNotFoundException("Usuário responsável não encontrado"));
            obra.setResponsavel(responsavel);
        }

        obraRepository.save(obra);

        return toResponseDTO(obra);
    }

    @Override
    public void deletarObra(Long obraId) {
        if (!obraRepository.existsById(obraId)) {
            throw new EntityNotFoundException("Obra não encontrada");
        }
        obraRepository.deleteById(obraId);
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
                obra.getStatus(),
                obra.getResponsavel() != null
                        ? obra.getResponsavel().getId()
                        : null
        );
    }
}