package com.project.blog.domain.post.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.category.entity.Category;
import com.project.blog.domain.category.repository.CategoryRepository;
import com.project.blog.domain.post.dto.req.PostReqDto;
import com.project.blog.domain.post.dto.res.PostResDto;
import com.project.blog.domain.post.entity.Post;
import com.project.blog.domain.post.repository.PostRepository;
import com.project.blog.domain.tag.entity.Tag;
import com.project.blog.domain.tag.service.TagService;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;

    @Transactional
    public PostResDto createPost(PostReqDto reqDto, AuthenticatedUser authenticatedUser) {
        Account author = authenticatedUser.getAccount();
        Category category = findCategoryById(reqDto.getCategoryId());
        List<Tag> tags = findOrCreateTags(reqDto.getTagNames(), author.getId());

        Post post = Post.builder()
            .title(reqDto.getTitle())
            .content(reqDto.getContent())
            .author(author)
            .category(category)
            .tags(tags)
            .isPublic(reqDto.getIsPublic() != null ? reqDto.getIsPublic() : true)
            .build();

        Post savedPost = postRepository.save(post);
        return PostResDto.from(savedPost);
    }

    @Transactional(readOnly = true)
    public Page<PostResDto> getAllPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findByIsPublicTrue(pageable);
        return posts.map(PostResDto::from);
    }

    @Transactional
    public PostResDto getPostById(Long id) {
        Post post = postRepository.findByIdWithDetails(id);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }

        post.incrementViewCount();

        return PostResDto.from(post);
    }

    @Transactional(readOnly = true)
    public Page<PostResDto> getPostsByAuthor(Long authorId, String category, Pageable pageable, Long requesterId) {
        Page<Post> posts;
        boolean isOwner = (requesterId != null && requesterId.equals(authorId));

        if (category == null || category.equalsIgnoreCase("all")) {
            posts = isOwner ? postRepository.findByAuthorId(authorId, pageable)
                    : postRepository.findByAuthorIdAndIsPublicTrue(authorId, pageable);
        } else if (category.equalsIgnoreCase("uncategorized")) {
            posts = isOwner ? postRepository.findByAuthorIdAndCategoryIsNull(authorId, pageable)
                    : postRepository.findByAuthorIdAndCategoryIsNullAndIsPublicTrue(authorId, pageable);
        } else {
            List<Long> categoryIds = Arrays.stream(category.split(","))
                    .map(Long::valueOf)
                    .collect(Collectors.toList());
            posts = isOwner ? postRepository.findByAuthorIdAndCategoryIdIn(authorId, categoryIds, pageable)
                    : postRepository.findByAuthorIdAndCategoryIdInAndIsPublicTrue(authorId, categoryIds, pageable);
        }

        return posts.map(PostResDto::from);
    }

    @Transactional(readOnly = true)
    public List<PostResDto> getUnpagedPostsByAuthor(Long authorId, Long requesterId) {
        List<Post> posts;
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        
        if (requesterId != null && requesterId.equals(authorId)) {
            posts = postRepository.findByAuthorId(authorId, sort);
        } else {
            posts = postRepository.findByAuthorIdAndIsPublicTrue(authorId, sort);
        }

        return posts.stream().map(PostResDto::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PostResDto> getPostsByCategory(Long categoryId, Pageable pageable) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        
        Page<Post> posts = postRepository.findByCategoryIdAndIsPublicTrue(categoryId, pageable);
        return posts.map(PostResDto::from);
    }

    @Transactional(readOnly = true)
    public Page<PostResDto> getPostsByTag(String tagName, Pageable pageable) {
        Page<Post> posts = postRepository.findPublicByTagName(tagName, pageable);
        return posts.map(PostResDto::from);
    }

    @Transactional(readOnly = true)
    public Page<PostResDto> searchPosts(String keyword, Pageable pageable) {
        Page<Post> posts = postRepository.searchPublicByTitleOrContent(keyword, pageable);
        return posts.map(PostResDto::from);
    }

    @Transactional(readOnly = true)
    public Page<PostResDto> searchPostsByAuthor(Long authorId, String keyword, Pageable pageable, Long requesterId) {
        Page<Post> posts;
        if (requesterId != null && requesterId.equals(authorId)) {
            posts = postRepository.searchByAuthorIdAndTitleOrContent(authorId, keyword, pageable);
        } else {
            posts = postRepository.searchPublicByAuthorIdAndTitleOrContent(authorId, keyword, pageable);
        }
        return posts.map(PostResDto::from);
    }

    @Transactional
    public PostResDto updatePost(Long id, PostReqDto reqDto, AuthenticatedUser authenticatedUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        if (post.getAuthor() == null || !post.getAuthor().getId().equals(authenticatedUser.getAccount().getId())) {
            throw new BusinessException(ErrorCode.POST_UPDATE_FORBIDDEN);
        }

        Category category = findCategoryById(reqDto.getCategoryId());
        List<Tag> tags = findOrCreateTags(reqDto.getTagNames(), authenticatedUser.getAccount().getId());

        post.updateTitle(reqDto.getTitle());
        post.updateContent(reqDto.getContent());
        post.updateCategory(category);
        post.updateTags(tags);
        if (reqDto.getIsPublic() != null) {
            post.updateVisibility(reqDto.getIsPublic());
        }

        return PostResDto.from(post);
    }

    @Transactional
    public void deletePost(Long id, AuthenticatedUser authenticatedUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        if (post.getAuthor() == null || !post.getAuthor().getId().equals(authenticatedUser.getAccount().getId())) {
            throw new BusinessException(ErrorCode.POST_DELETE_FORBIDDEN);
        }

        postRepository.delete(post);
    }

    @Transactional
    public void deletePosts(List<Long> ids, AuthenticatedUser authenticatedUser) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        List<Post> posts = postRepository.findAllById(ids);

        if (posts.size() != ids.size()) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }

        Long authorId = authenticatedUser.getAccount().getId();
        for (Post post : posts) {
            if (post.getAuthor() == null || !post.getAuthor().getId().equals(authorId)) {
                throw new BusinessException(ErrorCode.POST_DELETE_FORBIDDEN);
            }
        }

        postRepository.deleteAll(posts);
    }

    private Category findCategoryById(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private List<Tag> findOrCreateTags(List<String> tagNames, Long accountId) {
        if (tagNames == null || tagNames.isEmpty()) {
            return List.of();
        }
        return tagNames.stream()
                .map(name -> tagService.findOrCreateTag(name, accountId))
                .collect(Collectors.toList());
    }
}
