package com.project.blog.domain.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.blog.domain.account.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
}
