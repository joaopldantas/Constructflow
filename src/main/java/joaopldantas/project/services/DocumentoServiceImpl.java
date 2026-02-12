package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.entities.Documento;
import joaopldantas.project.entities.Obra;
import joaopldantas.project.entities.enums.StatusDocumento;
import joaopldantas.project.repositories.DocumentoRepository;
import joaopldantas.project.repositories.ObraRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentoServiceImpl implements DocumentoService{

    private final DocumentoRepository documentoRepository;
    private final ObraRepository obraRepository;

    public DocumentoServiceImpl(DocumentoRepository documentoRepository, ObraRepository obraRepository) {
        this.documentoRepository = documentoRepository;
        this.obraRepository = obraRepository;
    }

    @Override
    public Documento criarDocumento(Documento documento, Long obraId) {
        if (documento == null || obraId == null) {
            throw new IllegalArgumentException("Documento e obraId não podem ser nulos");
        }

        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        documento.setObra(obra);

        return documentoRepository.save(documento);
    }


    @Override
    public Optional<Documento> buscarPorId(Long documentoId) {
        if (documentoId == null) {
            return Optional.empty();
        }
        return documentoRepository.findById(documentoId);
    }

    @Override
    public List<Documento> listarTodos() {
        return documentoRepository.findAll();
    }

    @Override
    public List<Documento> listarPorObra(Long obraId) {
        if (obraId == null) {
            throw new IllegalArgumentException("ID não pode ser nulo");
        }
        return documentoRepository.findByObraId(obraId);
    }

    @Override
    public List<Documento> listarPorStatus(StatusDocumento status) {
        if (status == null) {
            throw new IllegalArgumentException("Status não pode ser nulo");
        }
        return documentoRepository.findByStatus(status);
    }

    @Override
    public List<Documento> listarPorObraEStatus(Long obraId, StatusDocumento status) {
        if (obraId == null || status == null) {
            throw new IllegalArgumentException("ID e Status não podem ser nulos");
        }
        return  documentoRepository.findByObraIdAndStatus(obraId, status);
    }

    @Override
    public Documento atualizarStatus(Long documentoId, StatusDocumento novoStatus) {
        if (documentoId == null || novoStatus == null) {
            throw new IllegalArgumentException("ID e Status não podem ser nulos");
        }

        return documentoRepository.findById(documentoId)
                .map(documento -> {
                    documento.setStatus(novoStatus);
                    return documentoRepository.save(documento);
                })
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
    }

    @Override
    public Documento atualizarNome(Long documentoId, String novoNome) {
        if (documentoId == null || novoNome == null || novoNome.isBlank()) {
            throw new IllegalArgumentException("ID e Nome não podem ser nulos ou vazios");
        }

        return documentoRepository.findById(documentoId)
                .map(documento ->{
                    documento.setNome(novoNome);
                    return documentoRepository.save(documento);
                })
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
    }

    @Override
    public void deletarDocumento(Long documentoId) {
        if (documentoId == null) {
            throw new IllegalArgumentException("ID não pode ser nulo");
        }
        if (!documentoRepository.existsById(documentoId)) {
            throw new EntityNotFoundException("Documento não encontrado");
        }

        documentoRepository.deleteById(documentoId);
    }
}
