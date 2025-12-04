package com.project.blog.domain.profile.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.blog.domain.profile.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    boolean existsByNickname(String nickname);

    boolean existsByBlogName(String blogName);

    Optional<Profile> findByNickname(String nickname);
}
