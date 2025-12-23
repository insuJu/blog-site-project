package com.project.blog.global.validation;

public final class ValidationConstants {

    private ValidationConstants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    // ==================== Length Constraints ====================

    public static final int USERNAME_MIN_LENGTH = 5;
    public static final int USERNAME_MAX_LENGTH = 20;

    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final int PASSWORD_MAX_LENGTH = 20;

    public static final int EMAIL_MAX_LENGTH = 50;

    public static final int NICKNAME_MIN_LENGTH = 2;
    public static final int NICKNAME_MAX_LENGTH = 8;

    public static final int BLOGNAME_MIN_LENGTH = 2;
    public static final int BLOGNAME_MAX_LENGTH = 30;

    public static final int POST_TITLE_MAX_LENGTH = 200;

    public static final int COMMENT_CONTENT_MAX_LENGTH = 1000;

    public static final int CATEGORY_NAME_MAX_LENGTH = 50;

    public static final int TAG_NAME_MAX_LENGTH = 30;

    // ==================== Regex Patterns ====================

    public static final String USERNAME_PATTERN = "^[a-zA-Z0-9]+$";

    public static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{1,}$";

    public static final String NICKNAME_PATTERN = "^[A-Za-z가-힣\\d!-/:-@\\[-`{-~]+$";

    public static final String PASSWORD_PATTERN = "^(?:(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[@#$%^&+=!])|(?=.*[0-9])(?=.*[@#$%^&+=!])).+$";

    public static final String BLOGNAME_PATTERN = "^.+$";

    public static final String HANGUL_PATTERN = ".*[ㄱ-ㅎㅏ-ㅣ가-힣].*";

    public static final String SPACE_PATTERN = ".*\\s.*";

    public static final String NO_SPACE_PATTERN = "^[^\\s]*$";

    public static final String NO_HANGUL_PATTERN = "^[^ㄱ-ㅎㅏ-ㅣ가-힣]*$";

    public static final String VERIFICATION_CODE_PATTERN = "^[0-9]{6}$";

    // ==================== Error Messages ====================

    public static final String MSG_USERNAME_REQUIRED = "아이디는 필수 입력값입니다.";
    public static final String MSG_USERNAME_SIZE = "아이디는 5~20자여야 합니다.";
    public static final String MSG_USERNAME_FORMAT = "아이디는 영문과 숫자만 사용할 수 있습니다.";
    public static final String MSG_USERNAME_NO_SPACE = "아이디는 공백을 포함할 수 없습니다.";
    public static final String MSG_USERNAME_NO_HANGUL = "아이디에 한글을 포함할 수 없습니다.";

    public static final String MSG_NEW_EMAIL_REQUIRED = "새로운 이메일 주소를 입력해주세요.";
    public static final String MSG_EMAIL_REQUIRED = "이메일은 필수 입력값입니다.";
    public static final String MSG_EMAIL_SIZE = "이메일은 최대 50자까지 가능합니다.";
    public static final String MSG_EMAIL_FORMAT = "유효하지 않은 이메일 형식입니다.";
    public static final String MSG_EMAIL_NO_SPACE = "이메일은 공백을 포함할 수 없습니다.";

    public static final String MSG_NEW_NICKNAME_REQUIRED = "새로운 닉네임을 입력해주세요.";
    public static final String MSG_NICKNAME_REQUIRED = "닉네임을 입력해주세요.";
    public static final String MSG_NICKNAME_SIZE = "닉네임은 2~8자여야 합니다.";
    public static final String MSG_NICKNAME_FORMAT = "닉네임은 영문/한글/숫자/특수문자만 가능합니다.";
    public static final String MSG_NICKNAME_NO_SPACE = "닉네임은 공백을 포함할 수 없습니다.";

    public static final String MSG_NEW_PASSWORD_REQUIRED = "새로운 비밀번호를 입력해주세요.";
    public static final String MSG_CURRENT_PASSWORD_REQUIRED = "현재 비밀번호를 입력해주세요.";
    public static final String MSG_PASSWORD_REQUIRED = "비밀번호는 필수 입력값입니다.";
    public static final String MSG_PASSWORD_SIZE = "비밀번호는 8~20자여야 합니다.";
    public static final String MSG_PASSWORD_FORMAT = "비밀번호는 영문, 숫자, 특수문자 중 최소 두 가지를 조합해야 합니다.";
    public static final String MSG_PASSWORD_NO_SPACE = "비밀번호는 공백을 포함할 수 없습니다.";
    public static final String MSG_PASSWORD_NO_HANGUL = "비밀번호에 한글을 사용할 수 없습니다.";

    public static final String MSG_NEW_BLOGNAME_REQUIRED = "새로운 블로그명을 입력해주세요.";
    public static final String MSG_BLOGNAME_SIZE = "블로그명은 2~30자여야 합니다.";

    public static final String MSG_AVATAR_REQUIRED = "아바타 파일은 필수입니다.";

    public static final String MSG_CODE_REQUIRED = "인증 코드는 필수 입력값입니다.";
    public static final String MSG_VERIFICATION_CODE_REQUIRED = "인증코드를 입력해주세요.";
    public static final String MSG_VERIFICATION_CODE_FORMAT = "인증코드는 6자리 숫자입니다.";

    public static final String MSG_POST_TITLE_REQUIRED = "제목은 필수입니다.";
    public static final String MSG_POST_TITLE_SIZE = "제목은 200자를 초과할 수 없습니다.";
    public static final String MSG_POST_CONTENT_REQUIRED = "내용은 필수입니다.";

    public static final String MSG_COMMENT_CONTENT_REQUIRED = "댓글 내용은 필수입니다.";
    public static final String MSG_COMMENT_CONTENT_SIZE = "댓글은 1000자를 초과할 수 없습니다.";

    public static final String MSG_CATEGORY_NAME_REQUIRED = "카테고리 이름은 필수입니다.";
    public static final String MSG_CATEGORY_NAME_SIZE = "카테고리 이름은 50자를 초과할 수 없습니다.";

    public static final String MSG_TAG_NAME_REQUIRED = "태그 이름은 필수입니다.";
    public static final String MSG_TAG_NAME_SIZE = "태그 이름은 30자를 초과할 수 없습니다.";
}
