package com.project.blog.domain.like.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.blog.domain.like.entity.PostLike;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    boolean existsByAccountIdAndPostId(Long accountId, Long postId);

    Optional<PostLike> findByAccountIdAndPostId(Long accountId, Long postId);

    Long countByPostId(Long postId);
}
