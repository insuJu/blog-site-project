package com.project.blog.domain.account.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmailSignupVerificationReqDto {

    @NotBlank(message = MSG_EMAIL_REQUIRED)
    @Pattern(regexp = EMAIL_PATTERN, message = MSG_EMAIL_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_EMAIL_NO_SPACE)
    private String email;
}
