package com.project.blog.domain.comment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.blog.domain.comment.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdAndParentIsNull(Long postId);

    List<Comment> findByParentId(Long parentId);

    List<Comment> findByPostId(Long postId);

    List<Comment> findByAuthorId(Long authorId);

    @Query("SELECT DISTINCT c FROM Comment c " +
            "LEFT JOIN FETCH c.author a " +
            "LEFT JOIN FETCH a.profile " +
            "LEFT JOIN FETCH c.parent " +
            "WHERE c.id = :id")
    Comment findByIdWithDetails(@Param("id") Long id);
}
