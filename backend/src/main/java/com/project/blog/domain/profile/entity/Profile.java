package com.project.blog.domain.profile.entity;

import com.project.blog.global.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Profile extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String nickname;

    @Column(nullable = false, unique = true, length = 30)
    private String blogName;

    private String avatar;

    // methods
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateBlogName(String blogName) {
        this.blogName = blogName;
    }

    public void updateAvatar(String avatar) {
        this.avatar = avatar;
    }
}
