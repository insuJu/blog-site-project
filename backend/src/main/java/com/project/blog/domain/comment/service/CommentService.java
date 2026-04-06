package com.project.blog.domain.comment.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.comment.dto.req.CommentReqDto;
import com.project.blog.domain.comment.dto.res.CommentResDto;
import com.project.blog.domain.comment.dto.res.CommentSummaryResDto;
import com.project.blog.domain.comment.entity.Comment;
import com.project.blog.domain.comment.repository.CommentRepository;
import com.project.blog.domain.post.entity.Post;
import com.project.blog.domain.post.repository.PostRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional
    public CommentResDto createComment(Long postId, CommentReqDto reqDto, AuthenticatedUser authenticatedUser) {
        Account author = authenticatedUser.getAccount();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        Comment parent = null;
        if (reqDto.getParentId() != null) {
            parent = commentRepository.findById(reqDto.getParentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

            if (!parent.getPost().getId().equals(postId)) {
                throw new BusinessException(ErrorCode.COMMENT_POST_MISMATCH);
            }
        }

        Comment comment = Comment.builder()
                .content(reqDto.getContent())
                .author(author)
                .post(post)
                .parent(parent)
                .isPublic(reqDto.getIsPublic() != null ? reqDto.getIsPublic() : true)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return CommentResDto.fromWithoutChildren(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResDto> getCommentsByPostId(Long postId, AuthenticatedUser authenticatedUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        List<Comment> rootComments = commentRepository.findByPostIdAndParentIsNull(postId);

        Long currentUserId = authenticatedUser != null ? authenticatedUser.getAccount().getId() : null;
        Long postAuthorId = post.getAuthor() != null ? post.getAuthor().getId() : null;

        return rootComments.stream()
                .map(comment -> filterPrivateComments(comment, currentUserId, postAuthorId))
                .filter(comment -> comment != null)
                .collect(Collectors.toList());
    }

    private CommentResDto filterPrivateComments(Comment comment, Long currentUserId, Long postAuthorId) {

        if (!comment.isPublic()) {
            if (currentUserId == null)
                return null;
            Long commentAuthorId = comment.getAuthor() != null ? comment.getAuthor().getId() : null;
            if (commentAuthorId == null ||
                    (!commentAuthorId.equals(currentUserId) && !commentAuthorId.equals(postAuthorId))) {
                return null;
            }
        }

        List<CommentResDto> filteredChildren = comment.getChildren().stream()
                .map(child -> filterPrivateComments(child, currentUserId, postAuthorId))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return CommentResDto.from(comment, filteredChildren);
    }

    @Transactional(readOnly = true)
    public CommentResDto getCommentById(Long id, AuthenticatedUser authenticatedUser) {
        Comment comment = commentRepository.findByIdWithDetails(id);
        if (comment == null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }

        if (!comment.isPublic()) {
            Long currentUserId = authenticatedUser != null ? authenticatedUser.getAccount().getId() : null;
            Long commentAuthorId = comment.getAuthor() != null ? comment.getAuthor().getId() : null;
            Long postAuthorId = comment.getPost().getAuthor() != null ? comment.getPost().getAuthor().getId() : null;

            if (currentUserId == null ||
                    (commentAuthorId != null && !currentUserId.equals(commentAuthorId) &&
                     postAuthorId != null && !currentUserId.equals(postAuthorId))) {
                throw new BusinessException(ErrorCode.COMMENT_ACCESS_FORBIDDEN);
            }
        }

        return CommentResDto.from(comment);
    }

    @Transactional
    public CommentResDto updateComment(Long id, CommentReqDto reqDto, AuthenticatedUser authenticatedUser) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        if (comment.getAuthor() == null || !comment.getAuthor().getId().equals(authenticatedUser.getAccount().getId())) {
            throw new BusinessException(ErrorCode.COMMENT_UPDATE_FORBIDDEN);
        }

        comment.updateContent(reqDto.getContent());
        if (reqDto.getIsPublic() != null) {
            comment.updateVisibility(reqDto.getIsPublic());
        }

        return CommentResDto.fromWithoutChildren(comment);
    }

    @Transactional
    public void deleteComment(Long id, AuthenticatedUser authenticatedUser) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        if (comment.getAuthor() == null || !comment.getAuthor().getId().equals(authenticatedUser.getAccount().getId())) {
            throw new BusinessException(ErrorCode.COMMENT_DELETE_FORBIDDEN);
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public void deleteComments(List<Long> ids, AuthenticatedUser authenticatedUser) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        List<Comment> comments = commentRepository.findAllById(ids);

        if (comments.size() != ids.size()) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }

        Long authorId = authenticatedUser.getAccount().getId();
        for (Comment comment : comments) {
            if (comment.getAuthor() == null || !comment.getAuthor().getId().equals(authorId)) {
                throw new BusinessException(ErrorCode.COMMENT_DELETE_FORBIDDEN);
            }
        }

        commentRepository.deleteAll(comments);
    }

    @Transactional(readOnly = true)
    public List<CommentSummaryResDto> getMyComments(AuthenticatedUser authenticatedUser) {
        Long authorId = authenticatedUser.getAccount().getId();
        List<Comment> comments = commentRepository.findByAuthorId(authorId);
        return comments.stream()
                .map(CommentSummaryResDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommentSummaryResDto> getCommentsByAuthorId(Long authorId, AuthenticatedUser authenticatedUser) {
        List<Comment> comments = commentRepository.findAllByAuthorIdOrPostAuthorId(authorId);
        Long currentUserId = authenticatedUser != null ? authenticatedUser.getAccount().getId() : null;

        return comments.stream()
                .filter(c -> {
                    if (c.isPublic()) return true;
                    if (currentUserId == null) return false;
                    
                    Long commentAuthorId = c.getAuthor() != null ? c.getAuthor().getId() : null;
                    Long postAuthorId = c.getPost().getAuthor() != null ? c.getPost().getAuthor().getId() : null;
                    
                    // 본인이거나 게시글 주인인 경우 비밀 댓글 노출
                    return currentUserId.equals(commentAuthorId) || currentUserId.equals(postAuthorId);
                })
                .map(CommentSummaryResDto::from)
                .collect(Collectors.toList());
    }
}
