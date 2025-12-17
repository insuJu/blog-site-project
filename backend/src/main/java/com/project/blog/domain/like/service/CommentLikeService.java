package com.project.blog.domain.like.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.comment.entity.Comment;
import com.project.blog.domain.comment.repository.CommentRepository;
import com.project.blog.domain.like.dto.res.MyLikeResDto;
import com.project.blog.domain.like.entity.CommentLike;
import com.project.blog.domain.like.repository.CommentLikeRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentLikeService {
    private final CommentLikeRepository commentLikeRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public boolean toggleCommentLike(Long commentId, AuthenticatedUser authenticatedUser) {
        Account account = authenticatedUser.getAccount();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        Optional<CommentLike> existingLike = commentLikeRepository.findByAccountIdAndCommentId(account.getId(), commentId);

        if (existingLike.isPresent()) {
            commentLikeRepository.delete(existingLike.get());
            comment.decrementLikeCount();
            return false;
        } else {
            CommentLike commentLike = CommentLike.builder()
                    .account(account)
                    .comment(comment)
                    .build();
            commentLikeRepository.save(commentLike);
            comment.incrementLikeCount();
            return true;
        }
    }

    @Transactional(readOnly = true)
    public boolean isCommentLiked(Long commentId, AuthenticatedUser authenticatedUser) {
        Account account = authenticatedUser.getAccount();
        return commentLikeRepository.existsByAccountIdAndCommentId(account.getId(), commentId);
    }

    @Transactional(readOnly = true)
    public List<MyLikeResDto> getMyCommentLikes(AuthenticatedUser authenticatedUser) {
        Long accountId = authenticatedUser.getAccount().getId();
        List<CommentLike> commentLikes = commentLikeRepository.findByAccountIdWithComment(accountId);
        return commentLikes.stream()
                .map(MyLikeResDto::fromCommentLike)
                .collect(Collectors.toList());
    }
}
