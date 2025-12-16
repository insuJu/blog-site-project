package com.project.blog.global.cloudinary.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.file.service.FileService;

import lombok.RequiredArgsConstructor;

@Service
@Profile("prod")
@RequiredArgsConstructor
public class CloudinaryService implements FileService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private static final String AVATAR_FOLDER = "blog/avatars";
    private static final String POST_FOLDER = "blog/posts";

    private static final int AVATAR_SIZE = 48;

    private final Cloudinary cloudinary;

    @Override
    public String uploadAvatar(MultipartFile file) {
        validateImage(file);

        Transformation<?> avatarTransform = new Transformation<>()
                .width(AVATAR_SIZE)
                .height(AVATAR_SIZE)
                .crop("fill")
                .gravity("face");

        return upload(file, AVATAR_FOLDER, avatarTransform);
    }

    @Override
    public String uploadPostImage(MultipartFile file) {
        validateImage(file);

        Transformation<?> postTransform = new Transformation<>()
                .quality("auto")
                .fetchFormat("auto");

        return upload(file, POST_FOLDER, postTransform);
    }

    @SuppressWarnings("unchecked")
    private String upload(
            MultipartFile file,
            String folder,
            Transformation<?> transformation
    ) {
        try {
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image",
                            "transformation", transformation
                    )
            );

            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_IS_EMPTY);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }
    }
}
