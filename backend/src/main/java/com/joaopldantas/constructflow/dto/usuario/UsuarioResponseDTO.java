package com.joaopldantas.constructflow.dto.usuario;

import com.joaopldantas.constructflow.entities.enums.Papel;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        Papel papel
) {}