package joaopldantas.project.services;

import joaopldantas.project.entities.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    Usuario criarUsuario(Usuario usuario);
    Optional<Usuario> buscarPorId(Long id);
    Optional<Usuario> buscarPorEmail(String email);
    List<Usuario> listarTodos();
    Usuario atualizarUsuario(Long id, Usuario usuarioAtualizado);
    void deletarUsuario(Long id);
    boolean emailJaExiste(String email);
}