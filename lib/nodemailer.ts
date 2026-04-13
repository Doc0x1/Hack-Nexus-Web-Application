import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., 'smtp.sendgrid.net' for SendGrid
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // e.g., 'apikey' for SendGrid
        pass: process.env.EMAIL_PASS // Your email service API key or password
    }
});

export const sendVerificationEmail = async (email: string, token: string, baseUrl: string) => {
    const verificationLink = `${baseUrl}/api/auth/verify?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM, // e.g., 'yourapp@example.com'
        to: email,
        subject: 'Verify Your Email',
        html: `
      <h1>Welcome!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};
