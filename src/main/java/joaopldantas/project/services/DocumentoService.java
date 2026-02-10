package joaopldantas.project.services;

import joaopldantas.project.entities.Documento;
import joaopldantas.project.enums.StatusDocumento;
import java.util.List;
import java.util.Optional;

public interface DocumentoService {

    Documento criarDocumento(Documento documento, Long obraId);
    Optional<Documento> buscarPorId(Long documentoId);
    List<Documento> listarTodos();
    List<Documento> listarPorObra(Long obraId);
    List<Documento> listarPorStatus(StatusDocumento status);
    List<Documento> listarPorObraEStatus(Long obraId, StatusDocumento status);
    Documento atualizarStatus(Long documentoId, StatusDocumento novoStatus);
    Documento atualizarNome(Long documentoId, String novoNome);

    void deletarDocumento(Long documentoId);
}