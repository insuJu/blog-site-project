package com.project.blog.domain.like.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.blog.domain.like.entity.PostLike;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    boolean existsByAccountIdAndPostId(Long accountId, Long postId);

    Optional<PostLike> findByAccountIdAndPostId(Long accountId, Long postId);

    Long countByPostId(Long postId);

    @Query("SELECT pl FROM PostLike pl JOIN FETCH pl.post WHERE pl.account.id = :accountId ORDER BY pl.createdAt DESC")
    List<PostLike> findByAccountIdWithPost(@Param("accountId") Long accountId);
}
