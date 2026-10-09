package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.entities.Usuario;
import joaopldantas.project.repositories.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioAutenticadoService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioAutenticadoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario getUsuarioLogado() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("Usuário logado não encontrado"));
    }
}