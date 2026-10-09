package com.joaopldantas.constructflow.dto.documento;

import jakarta.validation.constraints.NotBlank;

public record AtualizarNomeDocumentoDTO(

        @NotBlank(message = "Nome é obrigatório")
        String nome
) {}