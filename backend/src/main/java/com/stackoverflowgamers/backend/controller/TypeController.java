package com.stackoverflowgamers.backend.controller;

import com.stackoverflowgamers.backend.entity.Type;
import com.stackoverflowgamers.backend.service.TypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/type")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TypeController {
    private final TypeService typeService;

    @GetMapping
    public List<Type> getAll() {
        return typeService.getAll();
    }

    @GetMapping("/{id}")
    public Type getById(@PathVariable Integer id) {
        return typeService.getById(id);
    }

    @PostMapping
    public Type create(@Valid @RequestBody Type type) {
        return typeService.create(type);
    }

    @PutMapping("/{id}")
    public Type update(@PathVariable Integer id, @Valid @RequestBody Type type) {
        return typeService.update(id, type);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        typeService.delete(id);
    }
}