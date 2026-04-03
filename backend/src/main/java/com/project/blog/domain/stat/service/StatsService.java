package com.project.blog.domain.stat.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.comment.repository.CommentRepository;
import com.project.blog.domain.post.repository.PostRepository;
import com.project.blog.domain.stat.dto.res.StatsResDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public StatsResDto getSiteStats() {
        long postCount = postRepository.count();
        long commentCount = commentRepository.count();
        Long viewSum = postRepository.sumViewCount();
        long viewCount = viewSum != null ? viewSum : 0L;

        return StatsResDto.builder()
                .postCount(postCount)
                .commentCount(commentCount)
                .viewCount(viewCount)
                .build();
    }

    @Transactional(readOnly = true)
    public StatsResDto getAuthorStats(Long authorId) {
        long postCount = postRepository.countByAuthorId(authorId);
        Long viewSum = postRepository.sumViewCountByAuthorId(authorId);
        long viewCount = viewSum != null ? viewSum : 0L;
        long commentCount = commentRepository.countByPostAuthorId(authorId);

        return StatsResDto.builder()
                .postCount(postCount)
                .commentCount(commentCount)
                .viewCount(viewCount)
                .build();
    }
}
