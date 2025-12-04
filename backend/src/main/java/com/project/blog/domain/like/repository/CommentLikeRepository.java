package com.project.blog.domain.like.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.blog.domain.like.entity.CommentLike;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    boolean existsByAccountIdAndCommentId(Long accountId, Long commentId);

    Optional<CommentLike> findByAccountIdAndCommentId(Long accountId, Long commentId);

    Long countByCommentId(Long commentId);
}
