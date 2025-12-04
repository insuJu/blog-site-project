package com.project.blog.domain.category.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.blog.domain.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentIsNull();

    List<Category> findByParentId(Long parentId);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    boolean existsByNameAndParentId(String name, Long parentId);

    boolean existsByNameAndParentIdAndIdNot(String name, Long parentId, Long id);

    @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.children WHERE c.id = :id")
    Category findByIdWithChildren(Long id);
}
