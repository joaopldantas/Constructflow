package joaopldantas.project.dto.obra;

import joaopldantas.project.entities.enums.StatusObra;
import jakarta.validation.constraints.*;

public record CriarObraDTO(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Endereço é obrigatório")
        String endereco,

        @NotNull(message = "Status é obrigatório")
        StatusObra status,

        @NotNull(message = "Responsável é obrigatório")
        Long responsavelId

) {}