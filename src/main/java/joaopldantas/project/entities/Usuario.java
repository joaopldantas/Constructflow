package joaopldantas.project.entities;

import jakarta.persistence.*;
import joaopldantas.project.enums.Papel;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
@NoArgsConstructor
@ToString(exclude = "senhaHash")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Papel papel;

    public Usuario(String nome, String email, String senhaHash, Papel papel) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.papel = papel;
    }
}