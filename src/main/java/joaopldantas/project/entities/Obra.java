package joaopldantas.project.entities;

import jakarta.persistence.*;
import joaopldantas.project.entities.enums.StatusObra;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "obras")
@NoArgsConstructor
public class Obra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusObra status;

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Documento> documentos = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario responsavel;

    @ManyToMany
    @JoinTable(
            name = "obra_usuario",
            joinColumns = @JoinColumn(name = "obra_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> usuarios = new ArrayList<>();

    public Obra(String nome, String endereco, StatusObra status) {
        this.nome = nome;
        this.endereco = endereco;
        this.status = status;
    }
}
