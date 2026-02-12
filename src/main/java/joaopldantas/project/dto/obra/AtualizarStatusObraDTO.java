package joaopldantas.project.dto.obra;

import joaopldantas.project.entities.enums.StatusObra;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusObraDTO(

        @NotNull(message = "Status é obrigatório")
        StatusObra status
) {}