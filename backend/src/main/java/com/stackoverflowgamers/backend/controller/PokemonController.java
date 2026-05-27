package com.stackoverflowgamers.backend.controller;

import com.stackoverflowgamers.backend.entity.Pokemon;
import com.stackoverflowgamers.backend.service.PokemonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pokemon")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PokemonController {
    private final PokemonService pokemonService;

    @GetMapping
    public List<Pokemon> getAll() {
        return pokemonService.getAll();
    }

    @GetMapping("/{id}")
    public Pokemon getById(@PathVariable Integer id) {
        return pokemonService.getById(id);
    }

    @PostMapping
    public Pokemon create(@Valid @RequestBody Pokemon pokemon) {
        return pokemonService.create(pokemon);
    }

    @PutMapping("/{id}")
    public Pokemon update(@PathVariable Integer id, @Valid @RequestBody Pokemon pokemon) {
        return pokemonService.update(id, pokemon);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        pokemonService.delete(id);
    }

    @GetMapping("/type/{typeId}")
    public List<Pokemon> getByType(@PathVariable Integer typeId) {
        return pokemonService.findByType(typeId);
    }

    @GetMapping("/search")
    public List<Pokemon> searchByName(@RequestParam String name) {
        return pokemonService.findByName(name);
    }
}