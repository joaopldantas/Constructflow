package com.joaopldantas.constructflow.dto.documento;

import com.joaopldantas.constructflow.entities.enums.StatusDocumento;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusDocumentoDTO(

        @NotNull(message = "Status é obrigatório")
        StatusDocumento status
) {}