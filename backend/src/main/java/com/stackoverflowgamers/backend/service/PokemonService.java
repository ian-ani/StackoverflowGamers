package com.stackoverflowgamers.backend.service;

import com.stackoverflowgamers.backend.entity.Pokemon;
import com.stackoverflowgamers.backend.repository.PokemonRepository;
import com.stackoverflowgamers.backend.repository.TypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PokemonService {

    private final PokemonRepository pokemonRepository;
    private final TypeRepository typeRepository;

    public List<Pokemon> getAll() {
        return pokemonRepository.findAll();
    }

    public Pokemon getById(Integer id) {
        return pokemonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pokemon not found"));
    }

    public Pokemon create(Pokemon pokemon) {
        pokemon.setType(typeRepository.findById(pokemon.getType().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found")));
        return pokemonRepository.save(pokemon);
    }

    public Pokemon update(Integer id, Pokemon newData) {
        Pokemon existing = getById(id);

        existing.setName(newData.getName());
        existing.setEvolutionLevel(newData.getEvolutionLevel());
        existing.setBaseAtk(newData.getBaseAtk());
        existing.setBaseDef(newData.getBaseDef());
        existing.setBasePs(newData.getBasePs());
        existing.setGen(newData.getGen());
        existing.setType(typeRepository.findById(newData.getType().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found")));

        return pokemonRepository.save(existing);
    }

    public void delete(Integer id) {
        pokemonRepository.deleteById(id);
    }

    public List<Pokemon> findByType(Integer typeId) {
        return pokemonRepository.findByType_Id(typeId);
    }

    public List<Pokemon> findByName(String name) {
        return pokemonRepository.findByNameContainingIgnoreCase(name);
    }
}
