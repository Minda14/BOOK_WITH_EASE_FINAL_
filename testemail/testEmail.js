import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dummyrummy44@gmail.com', // Replace with your email
    pass: 'mhge uiei aoui zhho'  // Replace with your email password or app-specific password
  }
});

// Define the mail options
const mailOptions = {
  from: 'dummyrummy44@gmail.com',
  to: 'pm503@snu.edu.in', // Replace with the recipient's email
  subject: 'Test Email',
  text: 'This is a test email from Node.js'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
