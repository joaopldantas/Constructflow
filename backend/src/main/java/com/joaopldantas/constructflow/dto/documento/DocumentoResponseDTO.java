package com.joaopldantas.constructflow.dto.documento;

import com.joaopldantas.constructflow.entities.enums.StatusDocumento;
import com.joaopldantas.constructflow.entities.enums.TipoDocumento;

import java.time.LocalDateTime;

public record DocumentoResponseDTO(
        Long id,
        String nome,
        String caminhoArquivo,
        TipoDocumento tipo,
        StatusDocumento status,
        LocalDateTime dataUpload,
        Long obraId
) {}
