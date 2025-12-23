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
                    <style>
                        body { font-family:'Segoe UI', sans-serif; line-height: 1.6; color: #212529; background: #f8f9fa; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
                        .header { background: #f8f9fa; padding: 32px 24px; text-align: center; border-bottom: 1px solid #e9ecef; }
                        .header h1 { margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #212529; }
                        .header p { margin: 0; font-size: 14px; color: #6c757d; }
                        .content { padding: 32px 24px; }
                        .content > p { margin: 0 0 24px 0; font-size: 15px; color: #495057; }
                        .code-box { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0; }
                        .code-box-label { font-size: 13px; color: #6c757d; margin-bottom: 8px; }
                        .code { font-size: 32px; font-weight: 700; color: #212529; letter-spacing: 4px; }
                        .notice { background: #fff3cd; border-left: 3px solid #ffc107; padding: 16px; margin: 24px 0 0 0; border-radius: 4px; }
                        .notice p { margin: 4px 0; font-size: 13px; color: #856404; }
                        .footer { background: #f8f9fa; padding: 20px 24px; text-align: center; border-top: 1px solid #e9ecef; }
                        .footer p { margin: 0; color: #6c757d; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>쭈로그</h1>
                            <p>%s</p>
                        </div>
                        <div class="content">
                            <p>%s</p>
                            <div class="code-box">
                                <div class="code-box-label">인증코드</div>
                                <div class="code">%s</div>
                            </div>
                            <div class="notice">
                                <p>• 이 인증코드는 5분간 유효합니다.</p>
                                <p>• 본인이 요청하지 않았다면 이 이메일을 무시하세요.</p>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© 2025 쭈로그. All rights reserved.</p>
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
                    <style>
                        body { font-family:'Segoe UI', sans-serif; line-height: 1.6; color: #212529; background: #f8f9fa; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
                        .header { background: #f8f9fa; padding: 32px 24px; text-align: center; border-bottom: 1px solid #e9ecef; }
                        .header h1 { margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #212529; }
                        .header p { margin: 0; font-size: 14px; color: #6c757d; }
                        .content { padding: 32px 24px; }
                        .content > p { margin: 0 0 24px 0; font-size: 15px; color: #495057; }
                        .username-box { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 24px; margin: 24px 0; }
                        .username-box-label { font-size: 13px; color: #6c757d; margin-bottom: 8px; }
                        .username { font-size: 24px; font-weight: 700; color: #212529; }
                        .footer { background: #f8f9fa; padding: 20px 24px; text-align: center; border-top: 1px solid #e9ecef; }
                        .footer p { margin: 0; color: #6c757d; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>쭈로그</h1>
                            <p>아이디 찾기 결과</p>
                        </div>
                        <div class="content">
                            <p>요청하신 아이디 정보는 다음과 같습니다:</p>
                            <div class="username-box">
                                <div class="username-box-label">아이디</div>
                                <div class="username">%s</div>
                            </div>
                            <p>로그인 페이지에서 해당 아이디로 로그인하실 수 있습니다.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 쭈로그. All rights reserved.</p>
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
                    <style>
                        body { font-family:'Segoe UI', sans-serif; line-height: 1.6; color: #212529; background: #f8f9fa; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
                        .header { background: #f8f9fa; padding: 32px 24px; text-align: center; border-bottom: 1px solid #e9ecef; }
                        .header h1 { margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #212529; }
                        .header p { margin: 0; font-size: 14px; color: #6c757d; }
                        .content { padding: 32px 24px; }
                        .content > p { margin: 0 0 24px 0; font-size: 15px; color: #495057; }
                        .password-box { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0; }
                        .password-box-label { font-size: 13px; color: #6c757d; margin-bottom: 8px; }
                        .password { font-size: 20px; font-weight: 700; color: #212529; letter-spacing: 2px; }
                        .notice { background: #fff3cd; border-left: 3px solid #ffc107; padding: 16px; margin: 24px 0 0 0; border-radius: 4px; }
                        .notice strong { display: block; margin-bottom: 8px; font-size: 14px; color: #856404; }
                        .notice ul { margin: 8px 0 0 0; padding-left: 20px; }
                        .notice li { margin: 4px 0; font-size: 13px; color: #856404; }
                        .footer { background: #f8f9fa; padding: 20px 24px; text-align: center; border-top: 1px solid #e9ecef; }
                        .footer p { margin: 0; color: #6c757d; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>쭈로그</h1>
                            <p>임시 비밀번호 발급</p>
                        </div>
                        <div class="content">
                            <p>임시 비밀번호가 발급되었습니다:</p>
                            <div class="password-box">
                                <div class="password-box-label">임시 비밀번호</div>
                                <div class="password">%s</div>
                            </div>
                            <div class="notice">
                                <strong>보안 주의사항</strong>
                                <ul>
                                    <li>로그인 후 반드시 비밀번호를 변경해주세요.</li>
                                    <li>임시 비밀번호로는 로그인만 가능하며, 비밀번호 변경 페이지로 자동 이동됩니다.</li>
                                    <li>이 비밀번호를 타인과 공유하지 마세요.</li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© 2025 쭈로그. All rights reserved.</p>
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
        };
    }

    private static String getEmailMessage(EmailType type) {
        return switch (type) {
            case PASSWORD_RESET -> "비밀번호 재설정을 위한 인증코드를 보내드립니다.";
            case ACCOUNT_DELETION -> "회원탈퇴를 위한 인증코드를 보내드립니다.";
        };
    }
}
