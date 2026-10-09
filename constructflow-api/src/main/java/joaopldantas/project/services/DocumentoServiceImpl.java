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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentoServiceImpl implements DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final ObraRepository obraRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;
    private final AcessoObraService acessoObraService;

    public DocumentoServiceImpl(DocumentoRepository documentoRepository,
                                ObraRepository obraRepository,
                                UsuarioAutenticadoService usuarioAutenticadoService,
                                AcessoObraService acessoObraService) {
        this.documentoRepository = documentoRepository;
        this.obraRepository = obraRepository;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
        this.acessoObraService = acessoObraService;
    }

    @Override
    public DocumentoResponseDTO criarDocumento(CriarDocumentoDTO dto) {
        Obra obra = buscarObra(dto.obraId());
        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        acessoObraService.exigirVisualizacao(usuarioLogado, obra);

        if (dto.status() == null) {
            throw new BusinessException("Status do documento é obrigatório");
        }

        if (dto.status() != StatusDocumento.PENDENTE
                && !acessoObraService.podeAvaliarDocumentos(usuarioLogado, obra)) {
            throw new AccessDeniedException(
                    "Somente quem avalia documentos pode criá-los já aprovados ou reprovados"
            );
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
        Documento documento = buscarDocumentoAcessivel(documentoId);
        return toResponseDTO(documento);
    }

    @Override
    public List<DocumentoResponseDTO> listarTodos() {
        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        List<Documento> documentos = acessoObraService.acessaTodas(usuarioLogado)
                ? documentoRepository.findAll()
                : documentoRepository.findByObraIdIn(idsDasObrasVisiveis(usuarioLogado));

        return documentos.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<DocumentoResponseDTO> listarPorObra(Long obraId) {
        exigirAcessoObra(obraId);

        return documentoRepository.findByObraId(obraId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<DocumentoResponseDTO> listarPorStatus(StatusDocumento status) {
        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        List<Documento> documentos = acessoObraService.acessaTodas(usuarioLogado)
                ? documentoRepository.findByStatus(status)
                : documentoRepository.findByObraIdInAndStatus(idsDasObrasVisiveis(usuarioLogado), status);

        return documentos.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<DocumentoResponseDTO> listarPorObraEStatus(Long obraId, StatusDocumento status) {
        exigirAcessoObra(obraId);

        return documentoRepository.findByObraIdAndStatus(obraId, status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public DocumentoResponseDTO atualizarStatus(Long documentoId, AtualizarStatusDocumentoDTO dto) {
        Documento documento = buscarDocumento(documentoId);
        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        if (!acessoObraService.podeAvaliarDocumentos(usuarioLogado, documento.getObra())) {
            throw new AccessDeniedException(
                    "Somente ADMIN, BACKOFFICE ou o engenheiro responsável podem avaliar documentos"
            );
        }

        if (dto.status() == null) {
            throw new BusinessException("Status não pode ser nulo");
        }

        documento.setStatus(dto.status());
        documentoRepository.save(documento);

        return toResponseDTO(documento);
    }

    @Override
    public DocumentoResponseDTO atualizarNome(Long documentoId, AtualizarNomeDocumentoDTO dto) {
        Documento documento = buscarDocumentoAcessivel(documentoId);

        if (dto.nome() == null || dto.nome().isBlank()) {
            throw new BusinessException("Nome do documento é obrigatório");
        }

        documento.setNome(dto.nome());
        documentoRepository.save(documento);

        return toResponseDTO(documento);
    }

    @Override
    public void deletarDocumento(Long documentoId) {
        Documento documento = buscarDocumento(documentoId);
        Usuario usuarioLogado = usuarioAutenticadoService.getUsuarioLogado();

        if (usuarioLogado.getPapel() != Papel.ADMIN && usuarioLogado.getPapel() != Papel.BACKOFFICE) {
            throw new AccessDeniedException("Somente ADMIN ou BACKOFFICE podem excluir documentos");
        }

        documentoRepository.delete(documento);
    }

    private Obra buscarObra(Long obraId) {
        return obraRepository.findById(obraId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Obra não encontrada"));
    }

    private Documento buscarDocumento(Long documentoId) {
        return documentoRepository.findById(documentoId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Documento não encontrado"));
    }

    private Documento buscarDocumentoAcessivel(Long documentoId) {
        Documento documento = buscarDocumento(documentoId);
        acessoObraService.exigirVisualizacao(
                usuarioAutenticadoService.getUsuarioLogado(), documento.getObra());
        return documento;
    }

    private void exigirAcessoObra(Long obraId) {
        acessoObraService.exigirVisualizacao(
                usuarioAutenticadoService.getUsuarioLogado(), buscarObra(obraId));
    }

    private List<Long> idsDasObrasVisiveis(Usuario usuario) {
        return acessoObraService.obrasVisiveis(usuario)
                .stream()
                .map(Obra::getId)
                .toList();
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
