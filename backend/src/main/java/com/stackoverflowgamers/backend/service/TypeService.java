package com.stackoverflowgamers.backend.service;

import com.stackoverflowgamers.backend.entity.Type;
import com.stackoverflowgamers.backend.repository.TypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeService {
    private final TypeRepository typeRepository;

    public Type create(Type type) {
        return typeRepository.save(type);
    }

    public Type update(Integer id, Type newData) {
        Type existing = getById(id);
        existing.setName(newData.getName());
        existing.setEffectiveType(newData.getEffectiveType());
        existing.setWeakType(newData.getWeakType());
        return typeRepository.save(existing);
    }

    public List<Type> getAll() {
        return typeRepository.findAll();
    }

    public void delete(Integer id) {
        typeRepository.deleteById(id);
    }

    public Type getById(Integer id) {
        return typeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found"));
    }
}