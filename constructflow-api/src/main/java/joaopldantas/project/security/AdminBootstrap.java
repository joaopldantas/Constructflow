package joaopldantas.project.security;

import joaopldantas.project.entities.Usuario;
import joaopldantas.project.entities.enums.Papel;
import joaopldantas.project.repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria o primeiro ADMIN a partir de variáveis de ambiente, já que o cadastro
 * de usuários exige um ADMIN autenticado.
 */
@Component
public class AdminBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String nome;
    private final String email;
    private final String senha;

    public AdminBootstrap(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          @Value("${app.admin.nome}") String nome,
                          @Value("${app.admin.email}") String email,
                          @Value("${app.admin.senha}") String senha) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (usuarioRepository.existsByPapel(Papel.ADMIN)) {
            return;
        }

        if (email.isBlank() || senha.isBlank()) {
            log.warn("Nenhum ADMIN cadastrado. Defina ADMIN_EMAIL e ADMIN_SENHA para criar o administrador inicial.");
            return;
        }

        if (senha.length() < 6) {
            throw new IllegalStateException("ADMIN_SENHA deve ter no mínimo 6 caracteres");
        }

        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalStateException("ADMIN_EMAIL já pertence a um usuário que não é ADMIN: " + email);
        }

        usuarioRepository.save(new Usuario(nome, email, passwordEncoder.encode(senha), Papel.ADMIN));
        log.info("Administrador inicial criado: {}", email);
    }
}
