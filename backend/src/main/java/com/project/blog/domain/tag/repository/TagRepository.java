package com.project.blog.domain.tag.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.blog.domain.tag.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByName(String name);

    Optional<Tag> findByNameAndAccountId(String name, Long accountId);

    List<Tag> findByAccountId(Long accountId);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    boolean existsByNameAndAccountId(String name, Long accountId);

    boolean existsByNameAndIdNotAndAccountId(String name, Long id, Long accountId);

    List<Tag> findByNameContaining(String keyword);

    List<Tag> findByNameContainingAndAccountId(String keyword, Long accountId);

    List<Tag> findByNameStartingWith(String prefix);
}
