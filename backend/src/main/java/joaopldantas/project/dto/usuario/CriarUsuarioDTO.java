package joaopldantas.project.dto.usuario;

import joaopldantas.project.entities.enums.Papel;
import jakarta.validation.constraints.*;

public record CriarUsuarioDTO(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @Email(message = "Email inválido")
        @NotBlank(message = "Email é obrigatório")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String senha,

        @NotNull(message = "Papel é obrigatório")
        Papel papel

) {}