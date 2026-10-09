package com.joaopldantas.constructflow.dto.usuario;

import com.joaopldantas.constructflow.entities.enums.Papel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record AtualizarUsuarioDTO(

        String nome,

        @Email(message = "Email inválido")
        String email,

        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String senha,

        Papel papel

) {}