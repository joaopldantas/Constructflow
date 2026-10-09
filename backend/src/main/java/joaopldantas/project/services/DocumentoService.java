package joaopldantas.project.services;

import joaopldantas.project.dto.documento.*;
import joaopldantas.project.entities.enums.StatusDocumento;

import java.util.List;

public interface DocumentoService {

    DocumentoResponseDTO criarDocumento(CriarDocumentoDTO dto);
    DocumentoResponseDTO buscarPorId(Long documentoId);
    List<DocumentoResponseDTO> listarTodos();
    List<DocumentoResponseDTO> listarPorObra(Long obraId);
    List<DocumentoResponseDTO> listarPorStatus(StatusDocumento status);
    List<DocumentoResponseDTO> listarPorObraEStatus(Long obraId, StatusDocumento status);
    DocumentoResponseDTO atualizarStatus(Long documentoId, AtualizarStatusDocumentoDTO dto);
    DocumentoResponseDTO atualizarNome(Long documentoId, AtualizarNomeDocumentoDTO dto);
    void deletarDocumento(Long documentoId);
}