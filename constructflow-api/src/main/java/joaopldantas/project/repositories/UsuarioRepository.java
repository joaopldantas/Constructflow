package joaopldantas.project.repositories;

import joaopldantas.project.entities.Usuario;
import joaopldantas.project.entities.enums.Papel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPapel(Papel papel);
    long countByPapel(Papel papel);
}