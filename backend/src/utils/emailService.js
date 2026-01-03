const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email - HRMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for registering with our HRMS system.</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset Request - HRMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send leave approval notification
const sendLeaveApprovalEmail = async (email, employeeName, leaveDetails) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Leave Request Approved - HRMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Leave Request Approved</h2>
        <p>Hello ${employeeName},</p>
        <p>Your leave request has been approved.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Leave Type:</strong> ${leaveDetails.leaveType}</p>
          <p><strong>From:</strong> ${new Date(leaveDetails.startDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(leaveDetails.endDate).toLocaleDateString()}</p>
          <p><strong>Total Days:</strong> ${leaveDetails.totalDays}</p>
          ${leaveDetails.adminComments ? `<p><strong>Comments:</strong> ${leaveDetails.adminComments}</p>` : ''}
        </div>
        <p>Have a great time off!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Leave approval email sent to:', email);
  } catch (error) {
    console.error('Error sending leave approval email:', error);
  }
};

// Send leave rejection notification
const sendLeaveRejectionEmail = async (email, employeeName, leaveDetails) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Leave Request Rejected - HRMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f44336;">Leave Request Rejected</h2>
        <p>Hello ${employeeName},</p>
        <p>Unfortunately, your leave request has been rejected.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Leave Type:</strong> ${leaveDetails.leaveType}</p>
          <p><strong>From:</strong> ${new Date(leaveDetails.startDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(leaveDetails.endDate).toLocaleDateString()}</p>
          <p><strong>Total Days:</strong> ${leaveDetails.totalDays}</p>
          ${leaveDetails.adminComments ? `<p><strong>Reason:</strong> ${leaveDetails.adminComments}</p>` : ''}
        </div>
        <p>Please contact HR for more information.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Leave rejection email sent to:', email);
  } catch (error) {
    console.error('Error sending leave rejection email:', error);
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, employeeName, employeeId, tempPassword) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Welcome to HRMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our HRMS!</h2>
        <p>Hello ${employeeName},</p>
        <p>Your employee account has been created successfully.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Employee ID:</strong> ${employeeId}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p style="color: #f44336;"><strong>Important:</strong> Please change your password after first login.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/signin" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Login Now
          </a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLeaveApprovalEmail,
  sendLeaveRejectionEmail,
  sendWelcomeEmail
};