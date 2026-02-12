package joaopldantas.project.controllers;

import joaopldantas.project.entities.Documento;
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

    @PostMapping("/obras/{obraId}")
    public ResponseEntity<Documento> criarDocumento(
            @RequestBody Documento documento,
            @PathVariable Long obraId){
        Documento criado = documentoService.criarDocumento(documento, obraId);
        return ResponseEntity.status(201).body(criado);
    }

    @GetMapping("/{documentoId}")
    public ResponseEntity<Documento> buscarPorId(
            @PathVariable Long documentoId){
        return documentoService.buscarPorId(documentoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Documento>> listarTodos(){
        return ResponseEntity.ok(documentoService.listarTodos());
    }

    @GetMapping("/obras/{obraId}")
    public ResponseEntity<List<Documento>> listarPorObra(
            @PathVariable Long obraId){
        return ResponseEntity.ok(documentoService.listarPorObra(obraId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Documento>> listarPorStatus(
            @PathVariable StatusDocumento status){
        return ResponseEntity.ok(documentoService.listarPorStatus(status));
    }

    @GetMapping("/obras/{obraId}/status")
    public ResponseEntity<List<Documento>> listarPorObraEStatus(
            @PathVariable Long obraId,
            @RequestParam StatusDocumento status){
        return ResponseEntity.ok(
                documentoService.listarPorObraEStatus(obraId, status));
    }

    @PutMapping("/{documentoId}/novoStatus")
    public ResponseEntity<Documento> atualizarStatus(
            @PathVariable Long documentoId,
            @RequestBody StatusDocumento novoStatus){

        Documento atualizado = documentoService.atualizarStatus(
                documentoId, novoStatus);
        return ResponseEntity.ok(atualizado);
    }

    @PutMapping("/{documentoId}/novoNome")
    public ResponseEntity<Documento> atualizarNome(
            @PathVariable Long documentoId,
            @RequestParam String novoNome){

        Documento atualizado = documentoService.atualizarNome(
                documentoId, novoNome);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{documentoId}")
    public ResponseEntity<Void> deletarDocumento(@PathVariable Long documentoId) {
        documentoService.deletarDocumento(documentoId);
        return ResponseEntity.noContent().build();
    }
}