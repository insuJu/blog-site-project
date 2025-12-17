package com.project.blog.domain.like.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.like.dto.res.MyLikeResDto;
import com.project.blog.domain.like.entity.PostLike;
import com.project.blog.domain.like.repository.PostLikeRepository;
import com.project.blog.domain.post.entity.Post;
import com.project.blog.domain.post.repository.PostRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;

    @Transactional
    public boolean togglePostLike(Long postId, AuthenticatedUser authenticatedUser) {
        Account account = authenticatedUser.getAccount();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        Optional<PostLike> existingLike = postLikeRepository.findByAccountIdAndPostId(account.getId(), postId);

        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
            post.decrementLikeCount();
            return false;
        } else {
            PostLike postLike = PostLike.builder()
                    .account(account)
                    .post(post)
                    .build();
            postLikeRepository.save(postLike);
            post.incrementLikeCount();
            return true;
        }
    }

    @Transactional(readOnly = true)
    public boolean isPostLiked(Long postId, AuthenticatedUser authenticatedUser) {
        Account account = authenticatedUser.getAccount();
        return postLikeRepository.existsByAccountIdAndPostId(account.getId(), postId);
    }

    @Transactional(readOnly = true)
    public List<MyLikeResDto> getMyPostLikes(AuthenticatedUser authenticatedUser) {
        Long accountId = authenticatedUser.getAccount().getId();
        List<PostLike> postLikes = postLikeRepository.findByAccountIdWithPost(accountId);
        return postLikes.stream()
                .map(MyLikeResDto::fromPostLike)
                .collect(Collectors.toList());
    }
}
