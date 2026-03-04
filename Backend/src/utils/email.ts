import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    await transporter.sendMail({
        from: `"EcoWaste" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};

export const passwordResetEmailTemplate = (resetUrl: string): string => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 30px;">
    <h2 style="color: #2e7d32;">EcoWaste — Password Reset</h2>
    <p>You requested a password reset. Click the button below to set a new password.</p>
    <p><strong>This link expires in 15 minutes.</strong></p>
    <a href="${resetUrl}"
       style="display:inline-block;padding:12px 24px;background:#2e7d32;color:white;border-radius:6px;text-decoration:none;font-weight:bold;">
      Reset Password
    </a>
    <p style="margin-top:20px;color:#888;font-size:12px;">
      If you did not request this, ignore this email. Your password will remain unchanged.
    </p>
  </div>
</body>
</html>
`;
