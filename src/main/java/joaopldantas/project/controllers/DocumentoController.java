package joaopldantas.project.controllers;

import joaopldantas.project.services.DocumentoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/documentos")
public class DocumentoController {

    private final DocumentoService documentoService;
    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    // POST /documentos?obraId= (criar documento vinculado a uma obra)
    // GET /documentos/{id} (buscar documento por id)
    // GET /documentos (listar todos)
    // GET /documentos/obra/{obraId} (listar documentos de uma obra)
    // GET /documentos/status/{status} (listar por status)
    // GET /documentos/obra/{obraId}/status/{status} (listar por obra + status)
    // PUT /documentos/{id}/status (atualizar status)
    // PUT /documentos/{id}/nome (atualizar nome)
    // DELETE /documentos/{id} (deletar documento)
}