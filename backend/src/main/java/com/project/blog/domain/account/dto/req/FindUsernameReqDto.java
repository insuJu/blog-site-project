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
public class FindUsernameReqDto {

    @NotBlank(message = MSG_EMAIL_REQUIRED)
    @Size(max = EMAIL_MAX_LENGTH, message = MSG_EMAIL_SIZE)
    @Pattern(regexp = EMAIL_PATTERN, message = MSG_EMAIL_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_EMAIL_NO_SPACE)
    private String email;
}
