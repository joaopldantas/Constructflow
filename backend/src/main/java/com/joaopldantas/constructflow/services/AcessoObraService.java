package com.joaopldantas.constructflow.services;

import com.joaopldantas.constructflow.entities.Obra;
import com.joaopldantas.constructflow.entities.Usuario;
import com.joaopldantas.constructflow.entities.enums.Papel;
import com.joaopldantas.constructflow.repositories.ObraRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Regras de acesso às obras (e, por consequência, aos seus documentos).
 *
 * <ul>
 *   <li>ADMIN e BACKOFFICE: acessam todas as obras.</li>
 *   <li>ENGENHEIRO e CAMPO: acessam obras em que são responsáveis ou participantes.</li>
 *   <li>Avaliar documentos: ADMIN, BACKOFFICE ou o engenheiro responsável pela obra.</li>
 * </ul>
 */
@Service
public class AcessoObraService {

    private final ObraRepository obraRepository;

    public AcessoObraService(ObraRepository obraRepository) {
        this.obraRepository = obraRepository;
    }

    public boolean acessaTodas(Usuario usuario) {
        return usuario.getPapel() == Papel.ADMIN || usuario.getPapel() == Papel.BACKOFFICE;
    }

    public boolean podeVisualizar(Usuario usuario, Obra obra) {
        return acessaTodas(usuario) || ehResponsavel(usuario, obra) || ehParticipante(usuario, obra);
    }

    public boolean podeAvaliarDocumentos(Usuario usuario, Obra obra) {
        return acessaTodas(usuario)
                || (usuario.getPapel() == Papel.ENGENHEIRO && ehResponsavel(usuario, obra));
    }

    public void exigirVisualizacao(Usuario usuario, Obra obra) {
        if (!podeVisualizar(usuario, obra)) {
            throw new AccessDeniedException("Usuário não tem acesso a esta obra");
        }
    }

    public List<Obra> obrasVisiveis(Usuario usuario) {
        return acessaTodas(usuario)
                ? obraRepository.findAll()
                : obraRepository.findVisiveisPara(usuario.getId());
    }

    private boolean ehResponsavel(Usuario usuario, Obra obra) {
        return obra.getResponsavel() != null
                && obra.getResponsavel().getId().equals(usuario.getId());
    }

    private boolean ehParticipante(Usuario usuario, Obra obra) {
        return obra.getUsuarios().stream()
                .anyMatch(participante -> participante.getId().equals(usuario.getId()));
    }
}
