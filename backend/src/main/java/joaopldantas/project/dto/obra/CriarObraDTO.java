package joaopldantas.project.dto.obra;

import joaopldantas.project.entities.enums.StatusObra;
import jakarta.validation.constraints.*;

public record CriarObraDTO(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Endereço é obrigatório")
        String endereco,

        @NotBlank(message = "CEP é obrigatório")
        @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP deve estar no formato 00000-000")
        String cep,

        @NotNull(message = "Status é obrigatório")
        StatusObra status,

        @NotNull(message = "Responsável é obrigatório")
        Long responsavelId

) {}
