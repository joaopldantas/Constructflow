package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.dto.usuario.*;
import joaopldantas.project.entities.Usuario;
import joaopldantas.project.exceptions.BusinessException;
import joaopldantas.project.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository usuarioRepository;
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UsuarioResponseDTO criar(CriarUsuarioDTO dto) {
        if (emailJaExiste(dto.email())) {
            throw new BusinessException("Email já cadastrado!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenhaHash(dto.senha());
        usuario.setPapel(dto.papel());

        usuarioRepository.save(usuario);

        return toResponseDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Usuário não encontrado"));

        return toResponseDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("Usuário não encontrado"));

        return toResponseDTO(usuario);
    }

    @Override
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public UsuarioResponseDTO atualizar(Long id, AtualizarUsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Usuário não encontrado"));

        if (dto.email() != null && !dto.email().equals(usuario.getEmail())) {
            if (emailJaExiste(dto.email())) {
                throw new BusinessException("Email já cadastrado!");
            }
            usuario.setEmail(dto.email());
        }

        if (dto.nome() != null) usuario.setNome(dto.nome());
        if (dto.senha() != null) usuario.setSenhaHash(dto.senha());
        if (dto.papel() != null) usuario.setPapel(dto.papel());

        usuarioRepository.save(usuario);

        return toResponseDTO(usuario);
    }

    @Override
    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuário não encontrado para exclusão");
        }

        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean emailJaExiste(String email) {
        return usuarioRepository.existsByEmail(email);
    }
    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPapel()
        );
    }
}