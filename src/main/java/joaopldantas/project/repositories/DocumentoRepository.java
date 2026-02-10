package joaopldantas.project.repositories;

import joaopldantas.project.entities.Documento;
import joaopldantas.project.enums.StatusDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    List<Documento> findByObraId(Long obraId);
    List<Documento> findByStatus(StatusDocumento status);
    List<Documento> findByObraIdAndStatus(Long obraId, StatusDocumento status);
}