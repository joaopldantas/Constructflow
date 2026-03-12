package joaopldantas.project.dto.documento;

import joaopldantas.project.entities.enums.StatusDocumento;
import joaopldantas.project.entities.enums.TipoDocumento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CriarDocumentoDTO(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotNull(message = "Tipo é obrigatório")
        TipoDocumento tipo,

        @NotNull(message = "Status é obrigatório")
        StatusDocumento status,

        String caminhoArquivo,

        @NotNull(message = "Obra é obrigatória")
        Long obraId
) {}
