package joaopldantas.project.dto.documento;

import jakarta.validation.constraints.NotBlank;

public record AtualizarNomeDocumentoDTO(

        @NotBlank(message = "Nome é obrigatório")
        String nome
) {}