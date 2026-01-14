package com.project.blog.domain.tag.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.post.repository.PostRepository;
import com.project.blog.domain.tag.dto.req.TagReqDto;
import com.project.blog.domain.tag.dto.res.TagResDto;
import com.project.blog.domain.tag.entity.Tag;
import com.project.blog.domain.tag.repository.TagRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.util.ErrorUtil;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final PostRepository postRepository;

    @Transactional
    public TagResDto createTag(TagReqDto reqDto, Long accountId) {
        String name = reqDto.getName();

        Map<String, String> errors = new HashMap<>();

        ErrorUtil.addErrorIf(errors,
                tagRepository.existsByNameAndAccountId(name, accountId),
                "name",
                () -> ErrorCode.DUPLICATE_TAG_NAME.getMessage());

        ErrorUtil.throwIfNotEmpty(errors);

        Tag tag = Tag.builder()
                .name(name)
                .account(com.project.blog.domain.account.entity.Account.builder().id(accountId).build())
                .build();

        Tag savedTag = tagRepository.save(tag);
        return TagResDto.from(savedTag);
    }

    @Transactional(readOnly = true)
    public List<TagResDto> getAllTags(Long accountId) {
        List<Tag> tags = tagRepository.findByAccountId(accountId);
        return tags.stream()
                .map(TagResDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TagResDto getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TAG_NOT_FOUND));
        return TagResDto.from(tag);
    }

    @Transactional(readOnly = true)
    public List<TagResDto> searchTags(String keyword, Long accountId) {
        List<Tag> tags = tagRepository.findByNameContainingAndAccountId(keyword, accountId);
        return tags.stream()
                .map(TagResDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TagResDto updateTag(Long id, TagReqDto reqDto, AuthenticatedUser authenticatedUser) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TAG_NOT_FOUND));

        Long accountId = authenticatedUser.getAccount().getId();
        if (tag.getAccount() == null || !tag.getAccount().getId().equals(accountId)) {
            throw new BusinessException(ErrorCode.TAG_UPDATE_FORBIDDEN);
        }

        String name = reqDto.getName();

        Map<String, String> errors = new HashMap<>();

        if (!tag.getName().equals(name)) {
            ErrorUtil.addErrorIf(errors,
                    tagRepository.existsByNameAndIdNotAndAccountId(name, id, accountId),
                    "name",
                    () -> ErrorCode.DUPLICATE_TAG_NAME.getMessage());
        }

        ErrorUtil.throwIfNotEmpty(errors);

        tag.updateName(name);

        return TagResDto.from(tag);
    }

    @Transactional
    public void deleteTags(List<Long> ids, AuthenticatedUser authenticatedUser) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        List<Tag> tags = tagRepository.findAllById(ids);

        if (tags.size() != ids.size()) {
            throw new BusinessException(ErrorCode.TAG_NOT_FOUND);
        }

        Long accountId = authenticatedUser.getAccount().getId();
        for (Tag tag : tags) {
            if (tag.getAccount() == null || !tag.getAccount().getId().equals(accountId)) {
                throw new BusinessException(ErrorCode.TAG_DELETE_FORBIDDEN);
            }
            if (postRepository.existsByTagsId(tag.getId())) {
                throw new BusinessException(ErrorCode.CANNOT_DELETE_TAG_WITH_POSTS);
            }
        }

        tagRepository.deleteAll(tags);
    }

    @Transactional
    public Tag findOrCreateTag(String name, Long accountId) {
        return tagRepository.findByNameAndAccountId(name, accountId)
                .orElseGet(() -> tagRepository.save(Tag.builder()
                        .name(name)
                        .account(com.project.blog.domain.account.entity.Account.builder().id(accountId).build())
                        .build()));
    }
}
