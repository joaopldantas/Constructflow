package joaopldantas.project.controllers;

import jakarta.validation.Valid;
import joaopldantas.project.dto.documento.*;
import joaopldantas.project.entities.enums.StatusDocumento;
import joaopldantas.project.services.DocumentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documentos")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @PostMapping
    public ResponseEntity<DocumentoResponseDTO> criarDocumento(
            @Valid @RequestBody CriarDocumentoDTO dto) {

        DocumentoResponseDTO criado = documentoService.criarDocumento(dto);
        return ResponseEntity.status(201).body(criado);
    }

    @GetMapping("/{documentoId}")
    public ResponseEntity<DocumentoResponseDTO> buscarPorId(
            @PathVariable Long documentoId) {

        return ResponseEntity.ok(documentoService.buscarPorId(documentoId));
    }

    @GetMapping
    public ResponseEntity<List<DocumentoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(documentoService.listarTodos());
    }

    @GetMapping("/obras/{obraId}")
    public ResponseEntity<List<DocumentoResponseDTO>> listarPorObra(
            @PathVariable Long obraId) {

        return ResponseEntity.ok(documentoService.listarPorObra(obraId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DocumentoResponseDTO>> listarPorStatus(
            @PathVariable StatusDocumento status) {

        return ResponseEntity.ok(documentoService.listarPorStatus(status));
    }

    @GetMapping("/obras/{obraId}/status")
    public ResponseEntity<List<DocumentoResponseDTO>> listarPorObraEStatus(
            @PathVariable Long obraId,
            @RequestParam StatusDocumento status) {

        return ResponseEntity.ok(
                documentoService.listarPorObraEStatus(obraId, status));
    }

    @PutMapping("/{documentoId}/status")
    public ResponseEntity<DocumentoResponseDTO> atualizarStatus(
            @PathVariable Long documentoId,
            @Valid @RequestBody AtualizarStatusDocumentoDTO dto) {

        return ResponseEntity.ok(
                documentoService.atualizarStatus(documentoId, dto));
    }

    @PutMapping("/{documentoId}/nome")
    public ResponseEntity<DocumentoResponseDTO> atualizarNome(
            @PathVariable Long documentoId,
            @Valid @RequestBody AtualizarNomeDocumentoDTO dto) {

        return ResponseEntity.ok(
                documentoService.atualizarNome(documentoId, dto));
    }

    @DeleteMapping("/{documentoId}")
    public ResponseEntity<Void> deletarDocumento(
            @PathVariable Long documentoId) {

        documentoService.deletarDocumento(documentoId);
        return ResponseEntity.noContent().build();
    }
}