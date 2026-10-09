package joaopldantas.project.dto.usuario;

import joaopldantas.project.entities.enums.Papel;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        Papel papel
) {}