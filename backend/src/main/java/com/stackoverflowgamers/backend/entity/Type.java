package com.stackoverflowgamers.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "type")
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotBlank(message = "Se requiere el nombre del tipo")
    @Size(min = 2, max = 30)
    @Column(nullable = false, unique = true, name = "name")
    private String name;

    @NotBlank(message = "Se requiere el nombre del tipo efectivo")
    @Size(min = 2, max = 30)
    @Column(nullable = false, name = "effective_type")
    private String effectiveType;

    @NotBlank(message = "Se requiere el nombre del tipo débil")
    @Size(min = 2, max = 30)
    @Column(nullable = false, name = "weak_type")
    private String weakType;

    @OneToMany(mappedBy = "type")
    @JsonIgnore
    private List<Pokemon> pks;
}
