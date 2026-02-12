package joaopldantas.project.services;

import jakarta.persistence.EntityNotFoundException;
import joaopldantas.project.entities.Obra;
import joaopldantas.project.entities.Usuario;
import joaopldantas.project.entities.enums.StatusObra;
import joaopldantas.project.repositories.ObraRepository;
import joaopldantas.project.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ObraServiceImpl implements ObraService {

    private final ObraRepository obraRepository;
    private final UsuarioRepository usuarioRepository;

    public ObraServiceImpl(ObraRepository obraRepository, UsuarioRepository usuarioRepository) {
        this.obraRepository = obraRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Obra criarObra(Obra obra, Long responsavelId) {
        if (obra == null) {
            throw new IllegalArgumentException("Obra não pode ser nula");
        }

        if (responsavelId == null) {
            throw new IllegalArgumentException("Responsável não pode ser nulo");
        }
        Usuario responsavel = usuarioRepository.findById(responsavelId)
                .orElseThrow(() -> new RuntimeException("Usuário responsável não encontrado"));

        obra.setResponsavel(responsavel);

        return obraRepository.save(obra);
    }

    @Override
    public Optional<Obra> buscarPorId(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return obraRepository.findById(id);
    }

    @Override
    public List<Obra> listarTodas() {
        return obraRepository.findAll();
    }

    @Override
    public List<Obra> listarPorStatus(StatusObra status) {
        if (status == null) {
            throw new IllegalArgumentException("Status não pode ser nulo");
        }
        return obraRepository.findByStatus(status);
    }

    @Override
    public List<Obra> listarPorNome(String nome) {
        if (nome == null || nome.isBlank()) {
            return obraRepository.findAll();
        }
        return obraRepository.findByNomeContainingIgnoreCase(nome);
    }

    @Override
    public List<Obra> listarPorResponsavel(Long usuarioId) {
        if (usuarioId == null) {
            throw new IllegalArgumentException("ID não pode ser nulo");
        }
        return obraRepository.findByResponsavelId(usuarioId);
    }

    @Override
    public List<Obra> listarPorResponsavelEStatus(Long usuarioId, StatusObra status) {
        if (usuarioId == null || status == null) {
            throw new IllegalArgumentException("ID e Status não podem ser nulos");
        }
        return obraRepository.findByResponsavelIdAndStatus(usuarioId, status);
    }

    @Override
    public List<Obra> listarPorUsuarioParticipante(Long usuarioId) {
        if (usuarioId == null) {
            throw new IllegalArgumentException("ID do usuário não pode ser nulo");
        }
        return obraRepository.findByUsuariosId(usuarioId);
    }

    @Override
    public List<Obra> listarPorUsuarioParticipanteEStatus(Long usuarioId, StatusObra status) {
        if (usuarioId == null || status == null) {
            throw new IllegalArgumentException("ID e Status não podem ser nulos");
        }
        return obraRepository.findByUsuariosIdAndStatus(usuarioId, status);
    }

    @Override
    public Obra adicionarUsuarioNaObra(Long obraId, Long usuarioId) {
        if (obraId == null || usuarioId == null) {
            throw new IllegalArgumentException("IDs não podem ser nulos");
        }

        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        boolean jaExiste = obra.getUsuarios()
                .stream()
                .anyMatch(u -> u.getId().equals(usuarioId));

        if (jaExiste) {
            throw new IllegalArgumentException("Usuário já está nesta obra");
        }

        obra.getUsuarios().add(usuario);

        return obraRepository.save(obra);
    }

    @Override
    public Obra removerUsuarioDaObra(Long obraId, Long usuarioId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new EntityNotFoundException("Obra não encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        boolean usuarioObra = obra.getUsuarios()
                .stream()
                .anyMatch(u -> u.getId().equals(usuarioId));

        if (!usuarioObra) {
            throw new IllegalArgumentException("Usuário não faz parte dessa obra");
        }

        obra.getUsuarios().remove(usuario);

        return obraRepository.save(obra);
    }

    @Override
    public Obra atualizarStatus(Long obraId, StatusObra novoStatus) {
        if (obraId == null || novoStatus == null) {
            throw new IllegalArgumentException("ID e Status não podem ser nulos");
        }

        return obraRepository.findById(obraId)
                .map(obra -> {
                    obra.setStatus(novoStatus);
                    return obraRepository.save(obra);
                })
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
    }

    @Override
    public void deletarObra(Long obraId) {
        if (obraId == null) {
            throw new IllegalArgumentException("ID não pode ser nulo");
        }
        if (!obraRepository.existsById(obraId)) {
            throw new EntityNotFoundException("Obra não encontrada");
        }

        obraRepository.deleteById(obraId);
    }

    @Override
    public boolean existePorId(Long obraId) {
        if (obraId == null) {
            return false;
        }
        return obraRepository.existsById(obraId);
    }


}