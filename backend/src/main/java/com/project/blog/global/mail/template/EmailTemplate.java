package com.project.blog.global.mail.template;

import com.project.blog.global.mail.enums.EmailType;

public class EmailTemplate {

    public static String buildVerificationCodeEmail(String code, EmailType type) {
        String title = getEmailTitle(type);
        String message = getEmailMessage(type);

        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family:'Segoe UI', sans-serif; line-height: 1.6; color: #212529; background: #f8f9fa; margin: 0; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                        <div style="background: #f8f9fa; padding: 32px 24px; text-align: center; border-bottom: 1px solid #e9ecef;">
                            <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #212529;">Writon</h1>
                            <p style="margin: 0; font-size: 14px; color: #6c757d;">%s</p>
                        </div>
                        <div style="padding: 32px 24px;">
                            <p style="margin: 0 0 24px 0; font-size: 15px; color: #495057;">%s</p>
                            <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                                <div style="font-size: 13px; color: #6c757d; margin-bottom: 8px;">인증코드</div>
                                <div style="font-size: 32px; font-weight: 700; color: #212529; letter-spacing: 4px;">%s</div>
                            </div>
                            <div style="background: #fff3cd; border-left: 3px solid #ffc107; padding: 16px; margin: 24px 0 0 0; border-radius: 4px;">
                                <p style="margin: 4px 0; font-size: 13px; color: #856404;">• 이 인증코드는 5분간 유효합니다.</p>
                                <p style="margin: 4px 0; font-size: 13px; color: #856404;">• 본인이 요청하지 않았다면 이 이메일을 무시하세요.</p>
                            </div>
                        </div>
                        <div style="background: #f8f9fa; padding: 20px 24px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #6c757d; font-size: 12px;">© 2025 Writon. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """, title, message, code);
    }

    public static String buildUsernameEmail(String username) {
        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family:'Segoe UI', sans-serif; line-height: 1.6; color: #212529; background: #f8f9fa; margin: 0; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                        <div style="background: #f8f9fa; padding: 32px 24px; text-align: center; border-bottom: 1px solid #e9ecef;">
                            <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #212529;">Writon</h1>
                            <p style="margin: 0; font-size: 14px; color: #6c757d;">아이디 찾기 결과</p>
                        </div>
                        <div style="padding: 32px 24px;">
                            <p style="margin: 0 0 24px 0; font-size: 15px; color: #495057;">요청하신 아이디 정보는 다음과 같습니다:</p>
                            <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 24px; margin: 24px 0;">
                                <div style="font-size: 13px; color: #6c757d; margin-bottom: 8px;">아이디</div>
                                <div style="font-size: 24px; font-weight: 700; color: #212529;">%s</div>
                            </div>
                            <p style="margin: 0 0 24px 0; font-size: 15px; color: #495057;">로그인 페이지에서 해당 아이디로 로그인하실 수 있습니다.</p>
                        </div>
                        <div style="background: #f8f9fa; padding: 20px 24px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #6c757d; font-size: 12px;">© 2025 Writon. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """, username);
    }

    public static String buildTemporaryPasswordEmail(String tempPassword) {
        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family:'Segoe UI', sans-serif; line-height: 1.6; color: #212529; background: #f8f9fa; margin: 0; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                        <div style="background: #f8f9fa; padding: 32px 24px; text-align: center; border-bottom: 1px solid #e9ecef;">
                            <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #212529;">Writon</h1>
                            <p style="margin: 0; font-size: 14px; color: #6c757d;">임시 비밀번호 발급</p>
                        </div>
                        <div style="padding: 32px 24px;">
                            <p style="margin: 0 0 24px 0; font-size: 15px; color: #495057;">임시 비밀번호가 발급되었습니다:</p>
                            <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                                <div style="font-size: 13px; color: #6c757d; margin-bottom: 8px;">임시 비밀번호</div>
                                <div style="font-size: 20px; font-weight: 700; color: #212529; letter-spacing: 2px;">%s</div>
                            </div>
                            <div style="background: #fff3cd; border-left: 3px solid #ffc107; padding: 16px; margin: 24px 0 0 0; border-radius: 4px;">
                                <strong style="display: block; margin-bottom: 8px; font-size: 14px; color: #856404;">보안 주의사항</strong>
                                <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                                    <li style="margin: 4px 0; font-size: 13px; color: #856404;">로그인 후 반드시 비밀번호를 변경해주세요.</li>
                                    <li style="margin: 4px 0; font-size: 13px; color: #856404;">임시 비밀번호로는 로그인만 가능하며, 비밀번호 변경 페이지로 자동 이동됩니다.</li>
                                    <li style="margin: 4px 0; font-size: 13px; color: #856404;">이 비밀번호를 타인과 공유하지 마세요.</li>
                                </ul>
                            </div>
                        </div>
                        <div style="background: #f8f9fa; padding: 20px 24px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #6c757d; font-size: 12px;">© 2025 Writon. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """, tempPassword);
    }

    private static String getEmailTitle(EmailType type) {
        return switch (type) {
            case PASSWORD_RESET -> "비밀번호 재설정";
            case ACCOUNT_DELETION -> "회원탈퇴";
            case EMAIL_SIGNUP -> "회원가입";
        };
    }

    private static String getEmailMessage(EmailType type) {
        return switch (type) {
            case PASSWORD_RESET -> "비밀번호 재설정을 위한 인증코드를 보내드립니다.";
            case ACCOUNT_DELETION -> "회원탈퇴를 위한 인증코드를 보내드립니다.";
            case EMAIL_SIGNUP -> "회원가입을 위한 인증코드를 보내드립니다.";
        };
    }
}
