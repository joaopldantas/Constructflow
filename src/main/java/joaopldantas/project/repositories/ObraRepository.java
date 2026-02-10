package joaopldantas.project.repositories;

import joaopldantas.project.entities.Obra;
import joaopldantas.project.enums.StatusObra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Long> {

    List<Obra> findByStatus(StatusObra status);
    List<Obra> findByNomeContainingIgnoreCase(String nome);

    List<Obra> findByResponsavelId(Long usuarioId);
    List<Obra> findByResponsavelIdAndStatus(Long usuarioId, StatusObra status);

    List<Obra> findByUsuariosId(Long usuarioId);
    List<Obra> findByUsuariosIdAndStatus(Long usuarioId, StatusObra status);
}
