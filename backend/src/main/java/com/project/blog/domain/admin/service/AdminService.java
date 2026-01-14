package com.project.blog.domain.admin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.AccountStatus;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.admin.dto.res.AdminAccountResDto;
import com.project.blog.domain.admin.dto.res.AdminCategoryResDto;
import com.project.blog.domain.admin.dto.res.AdminCommentResDto;
import com.project.blog.domain.admin.dto.res.AdminPostResDto;
import com.project.blog.domain.admin.dto.res.AdminStatsResDto;
import com.project.blog.domain.admin.dto.res.AdminTagResDto;
import com.project.blog.domain.category.entity.Category;
import com.project.blog.domain.category.repository.CategoryRepository;
import com.project.blog.domain.comment.entity.Comment;
import com.project.blog.domain.comment.repository.CommentRepository;
import com.project.blog.domain.post.entity.Post;
import com.project.blog.domain.post.repository.PostRepository;
import com.project.blog.domain.tag.entity.Tag;
import com.project.blog.domain.tag.repository.TagRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {
    private final AccountRepository accountRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public AdminStatsResDto getStats() {
        long totalAccounts = accountRepository.count();
        long activeAccounts = accountRepository.findAll().stream()
            .filter(account -> account.getStatus() == AccountStatus.ACTIVE)
            .count();
        long deactivatedAccounts = totalAccounts - activeAccounts;

        long totalPosts = postRepository.count();
        long publicPosts = postRepository.findAll().stream()
            .filter(Post::isPublic)
            .count();
        long privatePosts = totalPosts - publicPosts;

        long totalComments = commentRepository.count();
        long totalCategories = categoryRepository.count();
        long totalTags = tagRepository.count();

        return AdminStatsResDto.builder()
            .totalAccounts(totalAccounts)
            .activeAccounts(activeAccounts)
            .deactivatedAccounts(deactivatedAccounts)
            .totalPosts(totalPosts)
            .publicPosts(publicPosts)
            .privatePosts(privatePosts)
            .totalComments(totalComments)
            .totalCategories(totalCategories)
            .totalTags(totalTags)
            .build();
    }

    public Page<AdminAccountResDto> getAllAccounts(Pageable pageable) {
        Page<Account> accounts = accountRepository.findAll(pageable);
        return accounts.map(account -> {
            Long postCount = postRepository.countByAuthorId(account.getId());
            Long commentCount = (long) commentRepository.findByAuthorId(account.getId()).size();
            return AdminAccountResDto.from(account, postCount, commentCount);
        });
    }

    @Transactional
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

        accountRepository.delete(account);
    }

    public Page<AdminPostResDto> getAllPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAll(pageable);
        return posts.map(AdminPostResDto::from);
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        postRepository.delete(post);
    }

    public Page<AdminCommentResDto> getAllComments(Pageable pageable) {
        Page<Comment> comments = commentRepository.findAll(pageable);
        return comments.map(AdminCommentResDto::from);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public List<AdminCategoryResDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
            .map(category -> {
                Long postCount = (long) postRepository.findByCategoryId(category.getId(), Pageable.unpaged()).getContent().size();
                return AdminCategoryResDto.from(category, postCount, category.getAccount().getUsername());
            })
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));

        List<Post> postsWithCategory = postRepository.findByCategoryId(categoryId, Pageable.unpaged()).getContent();
        postsWithCategory.forEach(post -> post.updateCategory(null));

        categoryRepository.delete(category);
    }

    public Page<AdminTagResDto> getAllTags(Pageable pageable) {
        Page<Tag> tags = tagRepository.findAll(pageable);
        return tags.map(tag -> {
            Long postCount = (long) postRepository.findAll().stream()
                .filter(post -> post.getTags().stream().anyMatch(t -> t.getId().equals(tag.getId())))
                .count();
            return AdminTagResDto.from(tag, postCount, tag.getAccount().getUsername());
        });
    }

    @Transactional
    public void deleteTag(Long tagId) {
        Tag tag = tagRepository.findById(tagId)
            .orElseThrow(() -> new BusinessException(ErrorCode.TAG_NOT_FOUND));

        List<Post> postsWithTag = postRepository.findAll().stream()
            .filter(post -> post.getTags().stream().anyMatch(t -> t.getId().equals(tagId)))
            .collect(Collectors.toList());

        postsWithTag.forEach(post -> {
            post.getTags().removeIf(t -> t.getId().equals(tagId));
        });

        tagRepository.delete(tag);
    }
}
