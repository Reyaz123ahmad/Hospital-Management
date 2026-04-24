// src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

class EmailService {
  async sendEmail(to, subject, html) {
    try {
      await transporter.sendMail({
        from: `"Hospital Management" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Email error:', error);
    }
  }

  async sendDoctorCredentials(email, name, userId, password) {
    const html = `
      <h2>Welcome Dr. ${name} to Our Hospital</h2>
      <p>Your account has been created by Admin.</p>
      <p><strong>Login Credentials:</strong></p>
      <ul>
        <li>User ID: ${userId}</li>
        <li>Email: ${email}</li>
        <li>Password: ${password}</li>
      </ul>
      <p>Please login and change your password immediately.</p>
      <a href="http://localhost:3000/login">Click here to Login</a>
    `;
    await this.sendEmail(email, 'Your Doctor Account Credentials', html);
  }

  async sendPatientAppointmentConfirmation(email, name, appointmentDetails) {
    const html = `
      <h2>Appointment Confirmed!</h2>
      <p>Dear ${name},</p>
      <p>Your appointment has been confirmed.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Doctor: ${appointmentDetails.doctorName}</li>
        <li>Date: ${appointmentDetails.date}</li>
        <li>Time: ${appointmentDetails.timeSlot}</li>
        <li>Consultation Fee: ₹${appointmentDetails.fee}</li>
      </ul>
      <p>Please arrive 15 minutes before your appointment time.</p>
    `;
    await this.sendEmail(email, 'Appointment Confirmation', html);
  }

  async sendAppointmentReminder(email, name, appointmentDetails) {
    const html = `
      <h2>Appointment Reminder</h2>
      <p>Dear ${name},</p>
      <p>This is a reminder for your appointment tomorrow.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Doctor: ${appointmentDetails.doctorName}</li>
        <li>Date: ${appointmentDetails.date}</li>
        <li>Time: ${appointmentDetails.timeSlot}</li>
      </ul>
    `;
    await this.sendEmail(email, 'Appointment Reminder', html);
  }

  async sendAppointmentCancellation(email, name, appointmentDetails, reason) {
    const html = `
      <h2>Appointment Cancelled</h2>
      <p>Dear ${name},</p>
      <p>Your appointment has been cancelled.</p>
      <p><strong>Cancelled Details:</strong></p>
      <ul>
        <li>Doctor: ${appointmentDetails.doctorName}</li>
        <li>Date: ${appointmentDetails.date}</li>
        <li>Time: ${appointmentDetails.timeSlot}</li>
        <li>Reason: ${reason}</li>
      </ul>
    `;
    await this.sendEmail(email, 'Appointment Cancelled', html);
  }

  async sendAutoRescheduleNotification(email, name, oldAppointment, newAppointment) {
    const html = `
      <h2>Appointment Auto-Rescheduled</h2>
      <p>Dear ${name},</p>
      <p>Due to doctor's schedule, your appointment has been auto-rescheduled.</p>
      <p><strong>Old Appointment:</strong> ${oldAppointment.date} at ${oldAppointment.timeSlot}</p>
      <p><strong>New Appointment:</strong> ${newAppointment.date} at ${newAppointment.timeSlot}</p>
      <p>We apologize for the inconvenience.</p>
    `;
    await this.sendEmail(email, 'Appointment Rescheduled', html);
  }

  async sendWelcomeEmail(email, name, userId, password) {
    const html = `
      <h2>Welcome to Hospital Management System</h2>
      <p>Dear ${name},</p>
      <p>Your account has been created successfully.</p>
      <p><strong>Login Credentials:</strong></p>
      <ul>
        <li>User ID: ${userId}</li>
        <li>Email: ${email}</li>
        <li>Password: ${password}</li>
      </ul>
      <p>Please login and complete your profile.</p>
    `;
    await this.sendEmail(email, 'Welcome to Hospital', html);
  }

  // Add these methods to src/services/emailService.js

    async sendPaymentConfirmation(email, name, paymentDetails) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .amount { font-size: 24px; color: #4CAF50; font-weight: bold; }
            .button { background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h2>Payment Confirmation</h2>
            </div>
            <div class="content">
            <p>Dear ${name},</p>
            <p>Your payment has been successfully processed.</p>
            <p><strong>Payment Details:</strong></p>
            <ul>
                <li>Appointment ID: ${paymentDetails.appointmentId}</li>
                <li>Amount: <span class="amount">₹${paymentDetails.amount}</span></li>
                <li>Payment ID: ${paymentDetails.paymentId}</li>
                <li>Date: ${new Date().toLocaleString()}</li>
            </ul>
            <p>Your appointment has been confirmed.</p>
            <a href="http://localhost:3000/appointments/${paymentDetails.appointmentId}" class="button">View Appointment</a>
            </div>
        </div>
        </body>
        </html>
    `;
    await this.sendEmail(email, 'Payment Confirmation - Hospital Management', html);
    }

    async sendRefundConfirmation(email, name, refundDetails) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h2>Refund Confirmation</h2>
            </div>
            <div class="content">
            <p>Dear ${name},</p>
            <p>Your refund has been processed successfully.</p>
            <p><strong>Refund Details:</strong></p>
            <ul>
                <li>Appointment ID: ${refundDetails.appointmentId}</li>
                <li>Refund Amount: ₹${refundDetails.amount}</li>
                <li>Refund ID: ${refundDetails.refundId}</li>
            </ul>
            <p>Amount will be credited to your original payment method within 5-7 business days.</p>
            </div>
        </div>
        </body>
        </html>
    `;
    await this.sendEmail(email, 'Refund Confirmation - Hospital Management', html);
    }
}

module.exports = new EmailService();