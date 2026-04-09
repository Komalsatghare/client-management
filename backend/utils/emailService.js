const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,     // Your Gmail address
        pass: process.env.EMAIL_PASS,     // Your Gmail App Password (not regular password)
    },
});

/**
 * Send an inquiry reply email to the user
 * @param {Object} options
 * @param {string} options.toEmail        - Recipient email (from inquiry form)
 * @param {string} options.toName         - Recipient name
 * @param {string} options.phone          - Recipient phone (shown in email footer)
 * @param {string} options.service        - Service they enquired about
 * @param {string} options.originalMessage - Their original inquiry message
 * @param {string} options.replyText      - Admin's reply
 */
const sendInquiryReplyEmail = async ({ toEmail, toName, phone, service, originalMessage, replyText }) => {
    const mailOptions = {
        from: `"Civil Engineering Services" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Re: Your Enquiry about ${service} — Civil Engineering`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 28px 32px;">
                    <h1 style="margin: 0; color: white; font-size: 22px;">Civil Engineering Services</h1>
                    <p style="margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Response to your enquiry</p>
                </div>

                <!-- Body -->
                <div style="padding: 28px 32px; background: #ffffff;">
                    <p style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">Dear <strong>${toName}</strong>,</p>
                    <p style="color: #475569; font-size: 15px; margin: 0 0 24px;">
                        Thank you for reaching out regarding <strong>${service}</strong>. Here is our response to your enquiry:
                    </p>

                    <!-- Admin Reply Box -->
                    <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
                        <p style="margin: 0 0 6px; font-size: 12px; font-weight: bold; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Our Response</p>
                        <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.6;">${replyText}</p>
                    </div>

                    <!-- Original message -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
                        <p style="margin: 0 0 6px; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Your Original Enquiry</p>
                        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6; font-style: italic;">"${originalMessage}"</p>
                    </div>

                    <p style="color: #475569; font-size: 14px; margin: 0 0 6px;">
                        If you have any further questions, feel free to reply to this email or contact us directly.
                    </p>
                    <p style="color: #475569; font-size: 14px; margin: 0;">
                        Your contact number on file: <strong>${phone}</strong>
                    </p>
                </div>

                <!-- Footer -->
                <div style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                        Civil Engineering Services &mdash; This is an automated reply from our admin panel.
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Send a password-reset OTP email
 * @param {string} toEmail   - Recipient email
 * @param {string} toName    - Recipient name or username
 * @param {string} otp       - 6-digit OTP code
 */
const sendOtpEmail = async (toEmail, toName, otp) => {
    const mailOptions = {
        from: `"NeedyConnect Security" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Your Password Reset OTP — ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0f172a, #1e3a5f); padding: 28px 32px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 22px; letter-spacing: -0.5px;">🔐 Password Reset</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 14px;">NeedyConnect Platform</p>
                </div>

                <!-- Body -->
                <div style="padding: 32px; background: #ffffff;">
                    <p style="color: #1e293b; font-size: 16px; margin: 0 0 12px;">Hello, <strong>${toName}</strong> 👋</p>
                    <p style="color: #475569; font-size: 15px; margin: 0 0 28px; line-height: 1.6;">
                        We received a request to reset your password. Use the OTP below to proceed. 
                        This code is valid for <strong>10 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 2px solid #86efac; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
                        <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; color: #16a34a; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password</p>
                        <p style="margin: 0; font-size: 42px; font-weight: 900; color: #15803d; letter-spacing: 10px; font-family: 'Courier New', monospace;">${otp}</p>
                        <p style="margin: 10px 0 0; font-size: 12px; color: #4ade80;">Expires in 10 minutes</p>
                    </div>

                    <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
                        <p style="margin: 0; font-size: 13px; color: #9a3412;">
                            ⚠️ <strong>Did not request this?</strong> You can safely ignore this email. Your password will not be changed unless you enter this OTP.
                        </p>
                    </div>

                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                        For security, never share this OTP with anyone.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                        NeedyConnect &mdash; Automated security email. Do not reply.
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendInquiryReplyEmail, sendOtpEmail };
