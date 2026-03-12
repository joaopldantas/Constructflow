package joaopldantas.project.entities;

import jakarta.persistence.*;
import joaopldantas.project.entities.enums.StatusDocumento;
import joaopldantas.project.entities.enums.TipoDocumento;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "documentos")
@NoArgsConstructor
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoDocumento tipo;

    @Enumerated(EnumType.STRING)
    private StatusDocumento status = StatusDocumento.PENDENTE;

    @Column
    private String caminhoArquivo;
    private LocalDateTime dataUpload;

    @PrePersist
    public void prePersist() {
        this.dataUpload = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obra_id", nullable = false)
    private Obra obra;

    public Documento(String nome, TipoDocumento tipo, String caminhoArquivo, Obra obra) {
        this.nome = nome;
        this.tipo = tipo;
        this.caminhoArquivo = caminhoArquivo;
        this.obra = obra;
    }

}
