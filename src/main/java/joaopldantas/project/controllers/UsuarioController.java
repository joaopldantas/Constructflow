package joaopldantas.project.controllers;

import joaopldantas.project.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // POST /usuarios (criar)
    // GET /usuarios/{id} (buscar)
    // GET /usuarios/email?email=joao@email.com (buscar)
    // GET /usuarios (listar todos)
    // PUT /usuarios/{id} (atualizar)
    // DELETE /usuarios/{id} (deletar)
}
