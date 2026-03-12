package joaopldantas.project.controllers;

import jakarta.validation.Valid;
import joaopldantas.project.dto.usuario.*;
import joaopldantas.project.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrarUsuario(
            @Valid @RequestBody CriarUsuarioDTO dto) {

        UsuarioResponseDTO criado = usuarioService.criar(dto);
        return ResponseEntity.status(201).body(criado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @GetMapping("/email")
    public ResponseEntity<UsuarioResponseDTO> buscarPorEmail(
            @RequestParam String email){

        return ResponseEntity.ok(usuarioService.buscarPorEmail(email));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarUsuarioDTO dto) {

        return ResponseEntity.ok(usuarioService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(
            @PathVariable Long id) {

        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}