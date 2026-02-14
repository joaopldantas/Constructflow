package joaopldantas.project.services;

import joaopldantas.project.dto.obra.*;
import joaopldantas.project.entities.enums.StatusObra;

import java.util.List;

public interface ObraService {

    ObraResponseDTO criar(CriarObraDTO dto);
    ObraResponseDTO buscarPorId(Long id);
    List<ObraResponseDTO> listarTodas();
    List<ObraResponseDTO> listarPorStatus(StatusObra status);
    List<ObraResponseDTO> listarPorNome(String nome);
    List<ObraResponseDTO> listarPorResponsavel(Long usuarioId);
    List<ObraResponseDTO> listarPorResponsavelEStatus(Long usuarioId, StatusObra status);
    List<ObraResponseDTO> listarPorUsuarioParticipante(Long usuarioId);
    List<ObraResponseDTO> listarPorUsuarioParticipanteEStatus(Long usuarioId, StatusObra status);
    ObraResponseDTO adicionarUsuarioNaObra(Long obraId, Long usuarioId);
    ObraResponseDTO removerUsuarioDaObra(Long obraId, Long usuarioId);
    ObraResponseDTO atualizarStatus(Long obraId, AtualizarStatusObraDTO dto);
    ObraResponseDTO atualizar(Long obraId, AtualizarObraDTO dto);
    void deletarObra(Long obraId);
    boolean existePorId(Long obraId);
}