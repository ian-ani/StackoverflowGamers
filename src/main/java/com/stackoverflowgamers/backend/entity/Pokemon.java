package com.stackoverflowgamers.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pokemon")
public class Pokemon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pokedex")
    private Integer idPokedex;

    @NotBlank(message = "Pokémon's name can't be blank.")
    @Column(name = "name")
    private String name;

    @Column(name = "evolution_level")
    private int evolutionLevel;

    @NotNull(message = "Base ATK can't be null.")
    @Column(name = "base_atk")
    private int baseAtk;

    @NotNull(message = "Base DEF can't be null.")
    @Column(name = "base_def")
    private int baseDef;

    @NotNull(message = "Base PS can't be null.")
    @Column(name = "base_ps")
    private int basePs;

    @NotNull(message = "Generation can't be null.")
    @Column(name = "gen")
    private int gen;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private Type type;
}
