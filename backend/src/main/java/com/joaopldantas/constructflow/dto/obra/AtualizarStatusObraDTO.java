package com.joaopldantas.constructflow.dto.obra;

import com.joaopldantas.constructflow.entities.enums.StatusObra;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusObraDTO(

        @NotNull(message = "Status é obrigatório")
        StatusObra status
) {}