package com.joaopldantas.constructflow.dto.obra;

import com.joaopldantas.constructflow.entities.enums.StatusObra;

public record ObraResponseDTO(
        Long id,
        String nome,
        String endereco,
        String cep,
        StatusObra status,
        Long responsavelId
) {}
