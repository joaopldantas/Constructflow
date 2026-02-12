package joaopldantas.project.services;

import joaopldantas.project.entities.Obra;
import joaopldantas.project.entities.enums.StatusObra;
import java.util.List;
import java.util.Optional;

public interface ObraService {

    Obra criarObra(Obra obra, Long responsavelId);
    Optional<Obra> buscarPorId(Long id);
    List<Obra> listarTodas();
    List<Obra> listarPorStatus(StatusObra status);
    List<Obra> listarPorNome(String nome);
    List<Obra> listarPorResponsavel(Long usuarioId);
    List<Obra> listarPorResponsavelEStatus(Long usuarioId, StatusObra status);
    List<Obra> listarPorUsuarioParticipante(Long usuarioId);
    List<Obra> listarPorUsuarioParticipanteEStatus(Long usuarioId, StatusObra status);
    Obra adicionarUsuarioNaObra(Long obraId, Long usuarioId);
    Obra removerUsuarioDaObra(Long obraId, Long usuarioId);
    Obra atualizarStatus(Long obraId, StatusObra novoStatus);
    boolean existePorId(Long obraId);
    void deletarObra(Long obraId);
}
