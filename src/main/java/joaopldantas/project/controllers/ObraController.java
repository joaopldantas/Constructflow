package joaopldantas.project.controllers;

import jakarta.validation.Valid;
import joaopldantas.project.dto.obra.*;
import joaopldantas.project.entities.enums.StatusObra;
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
    public ResponseEntity<ObraResponseDTO> criarObra(
            @Valid @RequestBody CriarObraDTO dto) {

        return ResponseEntity.status(201)
                .body(obraService.criar(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ObraResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(obraService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ObraResponseDTO>> listarTodas() {
        return ResponseEntity.ok(obraService.listarTodas());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ObraResponseDTO>> listarPorStatus(@PathVariable StatusObra status) {
        return ResponseEntity.ok(obraService.listarPorStatus(status));
    }

    @PatchMapping("/{obraId}/status")
    public ResponseEntity<ObraResponseDTO> atualizarStatus(
            @PathVariable Long obraId,
            @Valid @RequestBody AtualizarStatusObraDTO dto) {

        return ResponseEntity.ok(obraService.atualizarStatus(obraId, dto));
    }

    @PatchMapping("/{obraId}")
    public ResponseEntity<ObraResponseDTO> atualizarObra(
            @PathVariable Long obraId,
            @Valid @RequestBody AtualizarObraDTO dto) {

        return ResponseEntity.ok(obraService.atualizar(obraId, dto));
    }

    @DeleteMapping("/{obraId}")
    public ResponseEntity<Void> deletarObra(@PathVariable Long obraId) {
        obraService.deletarObra(obraId);
        return ResponseEntity.noContent().build();
    }
}