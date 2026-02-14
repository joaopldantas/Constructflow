package joaopldantas.project.dto.error;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponseDTO(
        int status,
        String error,
        String message,
        String path,
        LocalDateTime timestamp,
        Map<String, String> validationErrors
) {}