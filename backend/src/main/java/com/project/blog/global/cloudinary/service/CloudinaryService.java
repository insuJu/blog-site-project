package com.project.blog.global.cloudinary.service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.file.service.FileService;

import lombok.RequiredArgsConstructor;

@Service
@Profile("prod")
@RequiredArgsConstructor
public class CloudinaryService implements FileService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public String uploadAvatar(MultipartFile file) {
        validateFile(file);

        try {
            String publicId = "avatars/" + UUID.randomUUID().toString();

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", "blog/avatars",
                            "resource_type", "image",
                            "transformation", ObjectUtils.asMap(
                                    "width", 48,
                                    "height", 48,
                                    "crop", "fill",
                                    "gravity", "face")));

            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @SuppressWarnings("unchecked")
    public String uploadPostImage(MultipartFile file) {
        validateFile(file);

        try {
            String publicId = "posts/" + UUID.randomUUID().toString();

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", "blog/posts",
                            "resource_type", "image",
                            "transformation", ObjectUtils.asMap(
                                    "quality", "auto",
                                    "fetch_format", "auto")));

            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_IS_EMPTY);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }

        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }
    }
}
