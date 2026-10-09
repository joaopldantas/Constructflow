package com.joaopldantas.constructflow.services;

import jakarta.persistence.EntityNotFoundException;
import com.joaopldantas.constructflow.dto.usuario.*;
import com.joaopldantas.constructflow.entities.Usuario;
import com.joaopldantas.constructflow.entities.enums.Papel;
import com.joaopldantas.constructflow.exceptions.BusinessException;
import com.joaopldantas.constructflow.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UsuarioResponseDTO criar(CriarUsuarioDTO dto) {
        if (emailJaExiste(dto.email())) {
            throw new BusinessException("Email já cadastrado!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
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
        if (dto.senha() != null)
            usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        if (dto.papel() != null && dto.papel() != usuario.getPapel()) {
            garantirQueNaoEhUltimoAdmin(usuario);
            usuario.setPapel(dto.papel());
        }

        usuarioRepository.save(usuario);

        return toResponseDTO(usuario);
    }

    @Override
    public void deletarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Usuário não encontrado para exclusão"));

        garantirQueNaoEhUltimoAdmin(usuario);
        usuarioRepository.delete(usuario);
    }

    private void garantirQueNaoEhUltimoAdmin(Usuario usuario) {
        if (usuario.getPapel() == Papel.ADMIN && usuarioRepository.countByPapel(Papel.ADMIN) <= 1) {
            throw new BusinessException("O sistema precisa de pelo menos um ADMIN");
        }
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