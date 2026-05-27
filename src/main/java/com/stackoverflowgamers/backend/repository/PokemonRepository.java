package com.stackoverflowgamers.backend.repository;

import com.stackoverflowgamers.backend.entity.Pokemon;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PokemonRepository extends JpaRepository<@NonNull Pokemon, @NonNull Integer> {
    List<Pokemon> findByType_Id(Integer typeId);
    List<Pokemon> findByNameContainingIgnoreCase(String name);
}