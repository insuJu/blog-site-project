package com.project.blog.domain.account.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordUpdateReqDto {

    @NotBlank(message = MSG_CURRENT_PASSWORD_REQUIRED)
    private String currentPassword;

    @NotBlank(message = MSG_NEW_PASSWORD_REQUIRED)
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH, message = MSG_PASSWORD_SIZE)
    @Pattern(regexp = PASSWORD_PATTERN, message = MSG_PASSWORD_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_PASSWORD_NO_SPACE)
    @Pattern(regexp = NO_HANGUL_PATTERN, message = MSG_PASSWORD_NO_HANGUL)
    private String newPassword;
}
