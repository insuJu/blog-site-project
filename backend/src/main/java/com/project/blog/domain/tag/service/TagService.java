package com.project.blog.domain.tag.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.tag.dto.req.TagReqDto;
import com.project.blog.domain.tag.dto.res.TagResDto;
import com.project.blog.domain.tag.entity.Tag;
import com.project.blog.domain.tag.repository.TagRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.util.ErrorUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    @Transactional
    public TagResDto createTag(TagReqDto reqDto) {
        String name = reqDto.getName();

        Map<String, String> errors = new HashMap<>();

        ErrorUtil.addErrorIf(errors,
                tagRepository.existsByName(name),
                "name",
                () -> ErrorCode.DUPLICATE_TAG_NAME.getMessage());

        ErrorUtil.throwIfNotEmpty(errors);

        Tag tag = Tag.builder()
                .name(name)
                .build();

        Tag savedTag = tagRepository.save(tag);
        return TagResDto.from(savedTag);
    }

    @Transactional(readOnly = true)
    public List<TagResDto> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
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
    public List<TagResDto> searchTags(String keyword) {
        List<Tag> tags = tagRepository.findByNameContaining(keyword);
        return tags.stream()
                .map(TagResDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TagResDto updateTag(Long id, TagReqDto reqDto) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TAG_NOT_FOUND));

        String name = reqDto.getName();

        Map<String, String> errors = new HashMap<>();

        if (!tag.getName().equals(name)) {
            ErrorUtil.addErrorIf(errors,
                    tagRepository.existsByNameAndIdNot(name, id),
                    "name",
                    () -> ErrorCode.DUPLICATE_TAG_NAME.getMessage());
        }

        ErrorUtil.throwIfNotEmpty(errors);

        tag.updateName(name);

        return TagResDto.from(tag);
    }

    @Transactional
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TAG_NOT_FOUND));

        tagRepository.delete(tag);
    }

    @Transactional
    public Tag findOrCreateTag(String name) {
        return tagRepository.findByName(name)
                .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
    }
}
