package com.project.blog.global.validation;

public final class ValidationConstants {

    private ValidationConstants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    // ==================== Regex Patterns ====================

    public static final String USERNAME_PATTERN = "^[a-zA-Z0-9]{5,13}$";

    public static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{1,}$";

    public static final String NICKNAME_PATTERN = "^[A-Za-z가-힣\\d!-/:-@\\[-`{-~]{2,8}$";

    public static final String PASSWORD_PATTERN = "^(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[@#$%^&+=!])|(?=.*[0-9])(?=.*[@#$%^&+=!]).{8,20}$";

    public static final String BLOGNAME_PATTERN = "^.{2,30}$";

    public static final String HANGUL_PATTERN = ".*[ㄱ-ㅎㅏ-ㅣ가-힣].*";

    public static final String SPACE_PATTERN = ".*\\s.*";

    public static final String NO_SPACE_PATTERN = "^[^\\s]*$";

    public static final String NO_HANGUL_PATTERN = "^[^ㄱ-ㅎㅏ-ㅣ가-힣]*$";

    // ==================== Error Messages ====================

    public static final String MSG_USERNAME_REQUIRED = "아이디는 필수 입력값입니다.";
    public static final String MSG_USERNAME_FORMAT = "아이디는 영문, 숫자의 조합으로 5~13자리여야 합니다.";
    public static final String MSG_USERNAME_NO_SPACE = "아이디는 공백을 포함할 수 없습니다.";
    public static final String MSG_USERNAME_NO_HANGUL = "아이디에 한글을 포함할 수 없습니다.";

    public static final String MSG_EMAIL_REQUIRED = "이메일은 필수 입력값입니다.";
    public static final String MSG_EMAIL_FORMAT = "유효하지 않은 이메일 형식입니다.";
    public static final String MSG_EMAIL_NO_SPACE = "이메일은 공백을 포함할 수 없습니다.";
    public static final String MSG_EMAIL_NO_HANGUL = "이메일에 한글을 포함할 수 없습니다.";

    public static final String MSG_NICKNAME_REQUIRED = "닉네임을 입력해주세요.";
    public static final String MSG_NICKNAME_FORMAT = "2~8자의 영문/한글/숫자/특수문자만 가능합니다.";
    public static final String MSG_NICKNAME_NO_SPACE = "닉네임은 공백을 포함할 수 없습니다.";

    public static final String MSG_PASSWORD_REQUIRED = "비밀번호는 필수 입력값입니다.";
    public static final String MSG_PASSWORD_FORMAT = "비밀번호는 8~20자이며, 영문/숫자/특수문자 중 3가지 이상 포함해야 합니다.";
    public static final String MSG_PASSWORD_NO_SPACE = "비밀번호는 공백을 포함할 수 없습니다.";
    public static final String MSG_PASSWORD_NO_HANGUL = "비밀번호에 한글을 사용할 수 없습니다.";

    public static final String MSG_BLOGNAME_REQUIRED = "블로그명을 입력해주세요.";
    public static final String MSG_BLOGNAME_FORMAT = "블로그명은 2~30자여야 합니다.";

    public static final String MSG_AVATAR_REQUIRED = "아바타 파일은 필수입니다.";

    public static final String MSG_CODE_REQUIRED = "인증 코드는 필수 입력값입니다.";
}
