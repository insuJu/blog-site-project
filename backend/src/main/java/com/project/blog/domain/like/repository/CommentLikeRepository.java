package com.project.blog.domain.like.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.blog.domain.like.entity.CommentLike;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    boolean existsByAccountIdAndCommentId(Long accountId, Long commentId);

    Optional<CommentLike> findByAccountIdAndCommentId(Long accountId, Long commentId);

    Long countByCommentId(Long commentId);

    @Query("SELECT cl FROM CommentLike cl JOIN FETCH cl.comment c JOIN FETCH c.post WHERE cl.account.id = :accountId ORDER BY cl.createdAt DESC")
    List<CommentLike> findByAccountIdWithComment(@Param("accountId") Long accountId);
}
