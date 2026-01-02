package com.project.blog.global.mail.sender;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Profile("prod")
@RequiredArgsConstructor
public class ResendEmailSender implements EmailSender {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Override
    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            log.info("Attempting to send email via Resend API to: {}", to);
            log.debug("API Key present: {}, From email: {}", apiKey != null && !apiKey.isEmpty(), fromEmail);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("from", fromEmail);
            requestBody.put("to", List.of(to));
            requestBody.put("subject", subject);
            requestBody.put("html", htmlContent);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    RESEND_API_URL,
                    HttpMethod.POST,
                    request,
                    String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Failed to send email to: {}. Status: {}, Response: {}", to, response.getStatusCode(), response.getBody());
                throw new BusinessException(ErrorCode.VERIFICATION_CODE_SEND_FAILED);
            }

            log.info("Email sent successfully to: {} via Resend", to);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to send email to: {} via Resend. Error: {}", to, e.getMessage(), e);
            throw new BusinessException(ErrorCode.VERIFICATION_CODE_SEND_FAILED);
        }
    }
}
