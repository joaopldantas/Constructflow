package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.dto.documento.*;
import joaopldantas.project.entities.Documento;
import joaopldantas.project.entities.Obra;
import joaopldantas.project.entities.enums.StatusDocumento;
import joaopldantas.project.repositories.DocumentoRepository;
import joaopldantas.project.repositories.ObraRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentoServiceImpl implements DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final ObraRepository obraRepository;

    public DocumentoServiceImpl(DocumentoRepository documentoRepository,
                                ObraRepository obraRepository) {
        this.documentoRepository = documentoRepository;
        this.obraRepository = obraRepository;
    }

    @Override
    public DocumentoResponseDTO criarDocumento(CriarDocumentoDTO dto) {

        Obra obra = obraRepository.findById(dto.obraId())
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        Documento documento = new Documento();
        documento.setNome(dto.nome());
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
                .orElseThrow(() -> new EntityNotFoundException("Documento não encontrado"));

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
    public DocumentoResponseDTO atualizarStatus(Long documentoId,
                                                AtualizarStatusDocumentoDTO dto) {

        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new EntityNotFoundException("Documento não encontrado"));

        documento.setStatus(dto.status());

        documentoRepository.save(documento);

        return toResponseDTO(documento);
    }

    @Override
    public DocumentoResponseDTO atualizarNome(Long documentoId,
                                              AtualizarNomeDocumentoDTO dto) {

        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new EntityNotFoundException("Documento não encontrado"));

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
                documento.getTipo(),
                documento.getStatus(),
                documento.getDataUpload(),
                documento.getObra().getId()
        );
    }
}