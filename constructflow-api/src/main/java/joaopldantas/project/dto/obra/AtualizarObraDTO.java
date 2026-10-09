package joaopldantas.project.dto.obra;

import joaopldantas.project.entities.enums.StatusObra;
import jakarta.validation.constraints.Pattern;

public record AtualizarObraDTO(

        @Pattern(regexp = ".*\\S.*", message = "Nome não pode ser vazio")
        String nome,

        @Pattern(regexp = ".*\\S.*", message = "Endereço não pode ser vazio")
        String endereco,

        @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP deve estar no formato 00000-000")
        String cep,

        /** Mantido por compatibilidade; transições de status usam PATCH /obras/{id}/status. */
        StatusObra status,

        Long responsavelId

) {}
