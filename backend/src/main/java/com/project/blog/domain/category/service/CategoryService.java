package com.project.blog.domain.category.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.category.dto.req.CategoryReqDto;
import com.project.blog.domain.category.dto.res.CategoryResDto;
import com.project.blog.domain.category.entity.Category;
import com.project.blog.domain.category.repository.CategoryRepository;
import com.project.blog.domain.post.repository.PostRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.util.ErrorUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;

    @Transactional
    public CategoryResDto createCategory(CategoryReqDto reqDto, Long accountId) {
        String name = reqDto.getName();
        Long parentId = reqDto.getParentId();

        Map<String, String> errors = new HashMap<>();

        ErrorUtil.addErrorIf(errors,
                categoryRepository.existsByNameAndParentIdAndAccountId(name, parentId, accountId),
                "name",
                () -> ErrorCode.DUPLICATE_CATEGORY_NAME.getMessage());

        Category parent = null;
        if (parentId != null) {
            parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));

            ErrorUtil.addErrorIf(errors,
                    parent.getParent() != null,
                    "parentId",
                    () -> ErrorCode.MAX_CATEGORY_DEPTH_EXCEEDED.getMessage());
        }

        ErrorUtil.throwIfNotEmpty(errors);

        Category category = Category.builder()
                .name(name)
                .parent(parent)
                .account(com.project.blog.domain.account.entity.Account.builder().id(accountId).build())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return CategoryResDto.fromWithoutChildren(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryResDto> getAllCategories(Long accountId) {
        List<Category> topLevelCategories = categoryRepository.findByParentIsNullAndAccountId(accountId);
        return topLevelCategories.stream()
                .map(CategoryResDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        return CategoryResDto.from(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryResDto> getCategoriesByParentId(Long parentId, Long accountId) {
        categoryRepository.findById(parentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));

        List<Category> children = categoryRepository.findByParentIdAndAccountId(parentId, accountId);
        return children.stream()
                .map(CategoryResDto::fromWithoutChildren)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResDto updateCategory(Long id, CategoryReqDto reqDto, Long accountId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));

        String name = reqDto.getName();
        Long parentId = reqDto.getParentId();

        Map<String, String> errors = new HashMap<>();

        if (!category.getName().equals(name)) {
            ErrorUtil.addErrorIf(errors,
                    categoryRepository.existsByNameAndParentIdAndIdNotAndAccountId(name, parentId, id, accountId),
                    "name",
                    () -> ErrorCode.DUPLICATE_CATEGORY_NAME.getMessage());
        }

        Category newParent = null;
        if (parentId != null) {
            newParent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));

            if (parentId.equals(id)) {
                errors.put("parentId", ErrorCode.CIRCULAR_CATEGORY_REFERENCE.getMessage());
            }

            if (isDescendant(category, newParent)) {
                errors.put("parentId", ErrorCode.CIRCULAR_CATEGORY_REFERENCE.getMessage());
            }

            ErrorUtil.addErrorIf(errors,
                    newParent.getParent() != null,
                    "parentId",
                    () -> ErrorCode.MAX_CATEGORY_DEPTH_EXCEEDED.getMessage());
        }

        ErrorUtil.throwIfNotEmpty(errors);

        category.updateName(name);
        category.updateParent(newParent);

        return CategoryResDto.fromWithoutChildren(category);
    }

    @Transactional
    public void deleteCategories(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        List<Category> categories = categoryRepository.findAllById(ids);

        if (categories.size() != ids.size()) {
            throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        for (Category category : categories) {
            if (!category.getChildren().isEmpty()) {
                throw new BusinessException(ErrorCode.CANNOT_DELETE_CATEGORY_WITH_CHILDREN);
            }
            if (postRepository.existsByCategoryId(category.getId())) {
                throw new BusinessException(ErrorCode.CANNOT_DELETE_CATEGORY_WITH_POSTS);
            }
        }

        categoryRepository.deleteAll(categories);
    }

    private boolean isDescendant(Category currentCategory, Category targetCategory) {
        if (targetCategory.getParent() == null) {
            return false;
        }
        if (targetCategory.getParent().getId().equals(currentCategory.getId())) {
            return true;
        }
        return isDescendant(currentCategory, targetCategory.getParent());
    }
}
