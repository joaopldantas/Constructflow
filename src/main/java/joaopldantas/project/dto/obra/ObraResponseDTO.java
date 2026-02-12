package joaopldantas.project.dto.obra;

import joaopldantas.project.entities.enums.StatusObra;

public record ObraResponseDTO(
        Long id,
        String nome,
        String endereco,
        StatusObra status,
        Long responsavelId
) {}