package joaopldantas.project.dto.documento;

import joaopldantas.project.entities.enums.StatusDocumento;
import joaopldantas.project.entities.enums.TipoDocumento;

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
