package com.stackoverflowgamers.backend.repository;

import com.stackoverflowgamers.backend.entity.Type;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeRepository extends JpaRepository<@NonNull Type, @NonNull Integer> { }