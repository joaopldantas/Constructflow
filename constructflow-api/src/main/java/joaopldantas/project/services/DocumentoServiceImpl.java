package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.dto.documento.*;
import joaopldantas.project.entities.Documento;
import joaopldantas.project.entities.Obra;
import joaopldantas.project.entities.Usuario;
import joaopldantas.project.entities.enums.Papel;
import joaopldantas.project.entities.enums.StatusDocumento;
import joaopldantas.project.exceptions.BusinessException;
import joaopldantas.project.repositories.DocumentoRepository;
import joaopldantas.project.repositories.ObraRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentoServiceImpl implements DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final ObraRepository obraRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public DocumentoServiceImpl(DocumentoRepository documentoRepository,
                                ObraRepository obraRepository, UsuarioAutenticadoService usuarioAutenticadoService) {
        this.documentoRepository = documentoRepository;
        this.obraRepository = obraRepository;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
    }

    @Override
    public DocumentoResponseDTO criarDocumento(CriarDocumentoDTO dto) {
        Obra obra = obraRepository.findById(dto.obraId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Obra não encontrada"));

        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        if (usuarioLogado.getPapel() == Papel.CAMPO ||
                usuarioLogado.getPapel() == Papel.ENGENHEIRO) {

            if (!obra.getUsuarios().contains(usuarioLogado)) {
                throw new AccessDeniedException(
                        "Usuário só pode adicionar documento em obra vinculada"
                );
            }
        }

        if (dto.status() == null) {
            throw new BusinessException("Status do documento é obrigatório");
        }

        Documento documento = new Documento();
        documento.setNome(dto.nome());
        documento.setCaminhoArquivo(dto.caminhoArquivo());
        documento.setTipo(dto.tipo());
        documento.setStatus(dto.status());
        documento.setDataUpload(LocalDateTime.now());
        documento.setObra(obra);

        documentoRepository.save(documento);

        return toResponseDTO(documento);
    }

    @Override
    public DocumentoResponseDTO buscarPorId(Long documentoId) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Documento não encontrado"));

        return toResponseDTO(documento);
    }

    @Override
    public List<DocumentoResponseDTO> listarTodos() {
        return documentoRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<DocumentoResponseDTO> listarPorObra(Long obraId) {
        return documentoRepository.findByObraId(obraId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<DocumentoResponseDTO> listarPorStatus(StatusDocumento status) {
        return documentoRepository.findByStatus(status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<DocumentoResponseDTO> listarPorObraEStatus(Long obraId, StatusDocumento status) {
        return documentoRepository.findByObraIdAndStatus(obraId, status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public DocumentoResponseDTO atualizarStatus(Long documentoId, AtualizarStatusDocumentoDTO dto) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Documento não encontrado"));

        if (dto.status() == null) {
            throw new BusinessException("Status não pode ser nulo");
        }

        documento.setStatus(dto.status());
        documentoRepository.save(documento);

        return toResponseDTO(documento);
    }

    @Override
    public DocumentoResponseDTO atualizarNome(Long documentoId, AtualizarNomeDocumentoDTO dto) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Documento não encontrado"));

        if (dto.nome() == null || dto.nome().isBlank()) {
            throw new BusinessException("Nome do documento é obrigatório");
        }

        documento.setNome(dto.nome());
        documentoRepository.save(documento);

        return toResponseDTO(documento);
    }

    @Override
    public void deletarDocumento(Long documentoId) {

        if (!documentoRepository.existsById(documentoId)) {
            throw new EntityNotFoundException("Documento não encontrado");
        }

        documentoRepository.deleteById(documentoId);
    }

    private DocumentoResponseDTO toResponseDTO(Documento documento) {
        return new DocumentoResponseDTO(
                documento.getId(),
                documento.getNome(),
                documento.getCaminhoArquivo(),
                documento.getTipo(),
                documento.getStatus(),
                documento.getDataUpload(),
                documento.getObra().getId()
        );
    }
}
