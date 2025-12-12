package com.project.blog.global.file.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String uploadAvatar(MultipartFile file);
    String uploadPostImage(MultipartFile file);
}
