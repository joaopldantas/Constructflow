package com.joaopldantas.constructflow.repositories;

import com.joaopldantas.constructflow.entities.Documento;
import com.joaopldantas.constructflow.entities.enums.StatusDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    List<Documento> findByObraId(Long obraId);
    List<Documento> findByStatus(StatusDocumento status);
    List<Documento> findByObraIdAndStatus(Long obraId, StatusDocumento status);
    List<Documento> findByObraIdIn(Collection<Long> obraIds);
    List<Documento> findByObraIdInAndStatus(Collection<Long> obraIds, StatusDocumento status);
}