const verificationEmail  = (username, otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 20px;
            }
            .greeting {
                font-size: 16px;
                color: #333;
                margin-bottom: 20px;
            }
            .message {
                font-size: 14px;
                color: #666;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .otp-box {
                background-color: #f0f4ff;
                border: 2px solid #667eea;
                border-radius: 6px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            .otp-code {
                font-size: 32px;
                font-weight: 700;
                color: #667eea;
                letter-spacing: 4px;
                font-family: 'Courier New', monospace;
            }
            .validity {
                font-size: 12px;
                color: #999;
                margin-top: 15px;
                font-style: italic;
            }
            .footer {
                background-color: #f9f9f9;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #eee;
            }
            .footer-text {
                font-size: 12px;
                color: #999;
                margin: 5px 0;
            }
            .divider {
                height: 1px;
                background-color: #eee;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <p class="greeting">Hi ${username},</p>
                <p class="message">
                    Thank you for signing up! To complete your account activation, please enter the verification code below:
                </p>
                <div class="otp-box">
                    <div class="otp-label">Verification Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="validity">Valid for 10 minutes</div>
                </div>
                <p class="message">
                    If you didn't request this verification code, please ignore this email or contact our support team.
                </p>
            </div>
            <div class="footer">
                <p class="footer-text">© 2024 GOGO eCommerce. All rights reserved.</p>
                <p class="footer-text">If you need help, contact us at support@gogo.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default verificationEmail;
