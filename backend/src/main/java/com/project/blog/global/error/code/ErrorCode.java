package com.project.blog.global.error.code;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Authentication & Authorization
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH001", "아이디 또는 비밀번호가 올바르지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH002", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH003", "토큰이 만료되었습니다."),
    TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "AUTH004", "토큰을 찾을 수 없습니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH005", "접근이 거부되었습니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "AUTH006", "리프레시 토큰을 찾을 수 없습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH007", "유효하지 않은 리프레시 토큰입니다."),

    // Account
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "ACCOUNT001", "계정을 찾을 수 없습니다."),
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "ACCOUNT002", "이미 사용 중인 아이디입니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "ACCOUNT003", "이미 사용 중인 이메일입니다."),
    INCORRECT_PASSWORD(HttpStatus.BAD_REQUEST, "ACCOUNT004", "현재 비밀번호가 일치하지 않습니다."),
    SAME_PASSWORD(HttpStatus.BAD_REQUEST, "ACCOUNT005", "새 비밀번호가 현재 비밀번호와 동일합니다."),
    SAME_EMAIL(HttpStatus.BAD_REQUEST, "ACCOUNT006", "새 이메일이 현재 이메일과 동일합니다."),

    // Profile
    PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "PROFILE001", "프로필을 찾을 수 없습니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "PROFILE002", "이미 사용 중인 닉네임입니다."),
    DUPLICATE_BLOGNAME(HttpStatus.CONFLICT, "PROFILE003", "이미 사용 중인 블로그명입니다."),
    SAME_NICKNAME(HttpStatus.BAD_REQUEST, "PROFILE004", "새 닉네임이 현재 닉네임과 동일합니다."),
    SAME_BLOGNAME(HttpStatus.BAD_REQUEST, "PROFILE005", "새 블로그명이 현재 블로그명과 동일합니다."),

    // Category
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "CATEGORY001", "카테고리를 찾을 수 없습니다."),
    DUPLICATE_CATEGORY_NAME(HttpStatus.CONFLICT, "CATEGORY002", "이미 사용 중인 카테고리 이름입니다."),
    PARENT_CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "CATEGORY003", "부모 카테고리를 찾을 수 없습니다."),
    CANNOT_DELETE_CATEGORY_WITH_CHILDREN(HttpStatus.BAD_REQUEST, "CATEGORY004", "하위 카테고리가 있는 카테고리는 삭제할 수 없습니다."),
    CIRCULAR_CATEGORY_REFERENCE(HttpStatus.BAD_REQUEST, "CATEGORY005", "순환 참조가 발생할 수 있는 부모 카테고리입니다."),
    MAX_CATEGORY_DEPTH_EXCEEDED(HttpStatus.BAD_REQUEST, "CATEGORY006", "카테고리는 2단계까지만 생성할 수 있습니다."),

    // Tag
    TAG_NOT_FOUND(HttpStatus.NOT_FOUND, "TAG001", "태그를 찾을 수 없습니다."),
    DUPLICATE_TAG_NAME(HttpStatus.CONFLICT, "TAG002", "이미 사용 중인 태그 이름입니다."),

    // Post
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "POST001", "게시글을 찾을 수 없습니다."),
    POST_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "POST002", "게시글 수정 권한이 없습니다."),
    POST_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "POST003", "게시글 삭제 권한이 없습니다."),

    // Comment
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMENT001", "댓글을 찾을 수 없습니다."),
    COMMENT_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "COMMENT002", "댓글 수정 권한이 없습니다."),
    COMMENT_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "COMMENT003", "댓글 삭제 권한이 없습니다."),
    COMMENT_POST_MISMATCH(HttpStatus.BAD_REQUEST, "COMMENT005", "부모 댓글이 다른 게시글에 속해 있습니다."),
    COMMENT_ACCESS_FORBIDDEN(HttpStatus.FORBIDDEN, "COMMENT006", "비공개 댓글 조회 권한이 없습니다."),

    // Like
    LIKE_NOT_FOUND(HttpStatus.NOT_FOUND, "LIKE001", "좋아요를 찾을 수 없습니다."),

    // Validation
    INPUT_VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "VALIDATION001", "입력값 검증에 실패했습니다."),
    INPUT_BUSINESS_ERROR(HttpStatus.BAD_REQUEST, "VALIDATION002", "입력값 유효성 검증에 실패했습니다."),

    // Common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "COMMON001", "잘못된 입력입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON002", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}