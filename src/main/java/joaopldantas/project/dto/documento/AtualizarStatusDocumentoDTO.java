package joaopldantas.project.dto.documento;

import joaopldantas.project.entities.enums.StatusDocumento;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusDocumentoDTO(

        @NotNull(message = "Status é obrigatório")
        StatusDocumento status
) {}