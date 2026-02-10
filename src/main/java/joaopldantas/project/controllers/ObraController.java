package joaopldantas.project.controllers;

import joaopldantas.project.entities.Obra;
import joaopldantas.project.enums.StatusObra;
import joaopldantas.project.services.ObraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/obras")
public class ObraController {

    private final ObraService obraService;
    public ObraController(ObraService obraService) {
        this.obraService = obraService;
    }

    @PostMapping
    public ResponseEntity<Obra> criarObra(
            @RequestBody Obra obra,
            @RequestParam Long responsavelId) {

        Obra criada = obraService.criarObra(obra, responsavelId);
        return ResponseEntity.status(201).body(criada);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Obra> buscarPorId(@PathVariable Long id) {
        return obraService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Obra>> listarTodas() {
        return ResponseEntity.ok(obraService.listarTodas());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Obra>> listarPorStatus(@PathVariable StatusObra status) {
        return ResponseEntity.ok(obraService.listarPorStatus(status));
    }

    @PostMapping("/{obraId}/usuarios/{usuarioId}")
    public ResponseEntity<Obra> adicionarUsuario(
            @PathVariable Long obraId,
            @PathVariable Long usuarioId) {

        Obra atualizada = obraService.adicionarUsuarioNaObra(obraId, usuarioId);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{obraId}")
    public ResponseEntity<Void> deletarObra(@PathVariable Long obraId) {
        if (!obraService.existePorId(obraId)) {
            return ResponseEntity.notFound().build();
        }

        obraService.deletarObra(obraId);
        return ResponseEntity.noContent().build();
    }
}
