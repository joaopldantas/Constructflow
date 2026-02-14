package joaopldantas.project.services;

import joaopldantas.project.dto.usuario.*;

import java.util.List;

public interface UsuarioService {

    UsuarioResponseDTO criar(CriarUsuarioDTO dto);
    UsuarioResponseDTO buscarPorId(Long id);
    UsuarioResponseDTO buscarPorEmail(String email);
    List<UsuarioResponseDTO> listarTodos();
    UsuarioResponseDTO atualizar(Long id, AtualizarUsuarioDTO dto);
    void deletarUsuario(Long id);
    boolean emailJaExiste(String email);
}