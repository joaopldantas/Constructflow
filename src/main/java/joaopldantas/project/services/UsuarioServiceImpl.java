package joaopldantas.project.services;

import joaopldantas.project.entities.Usuario;
import joaopldantas.project.repositories.UsuarioRepository;
import org.springframework.stereotype.*;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService{
    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario criarUsuario(Usuario usuario) {
        if (emailJaExiste(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado!");
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario atualizarUsuario(Long id, Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setSenhaHash(usuarioAtualizado.getSenhaHash());
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setPapel(usuarioAtualizado.getPapel());
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Override
    public void deletarUsuario(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Id não pode ser null");
        }

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado para exclusão");
        }

        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean emailJaExiste(String email) {
        if (email == null) {
            return false;
        }
        return usuarioRepository.existsByEmail(email);
    }
}
