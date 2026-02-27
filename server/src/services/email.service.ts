import { transporter } from '../config/mail.config';

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const frontendUrl = process.env.FRONTEND_URL;

  const verificationLink = `${frontendUrl}/auth/verification/${token}`;

  await transporter.sendMail({
    from: `"QuizBeez" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
         <h2>Welcome to the QuizBeez App!</h2>
         <p>Please click the button below to verify your email address and activate your account.</p>
         <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
           Verify Email
         </a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
           If you didn't create an account, you can safely ignore this email.
         </p>
       </div>
    `,
  });
};


export const sendResetPasswordEmail = async (
  email: string,
  token: string
) => {
  const frontendUrl =
    process.env.FRONTEND_URL;

  const resetPasswordLink =
    `${frontendUrl}/auth/password-reset/${token}`;

  await transporter.sendMail({
    from: `"QuizBeez" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
         <h2>Reset your password</h2>
         <p>Please click the button below to reset your your password</p>
         <a href="${resetPasswordLink}" style="background-color: #F44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
           Reset Password
         </a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
           If you didn't request to reset your password, ignore this email or contact us at quizbeez@gmail.com.
         </p>
       </div>
    `,
  });
};
