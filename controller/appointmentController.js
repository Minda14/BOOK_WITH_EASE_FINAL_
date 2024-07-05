import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import nodemailer from 'nodemailer';
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    rollno,
    appointment_date,
    department,
    location_firstName,
    location_lastName,
    isUrgent,
    //address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !rollno ||
    
    !appointment_date ||
    !department ||
    !location_firstName ||
    !location_lastName 
   // !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isConflict = await User.find({
    firstName: location_firstName,
    lastName: location_lastName,
    role: "location",
    locationDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("location not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "locations Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  const locationId = isConflict[0]._id;
  const studentId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    rollno,
    
    appointment_date,
    department,
    location: {
      firstName: location_firstName,
      lastName: location_lastName,
    },
    isUrgent,
   // address,
    locationId,
    studentId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dummyrummy44@gmail.com', // Replace with your email
    pass: 'mhge uiei aoui zhho' // Replace with your email password
  }
});

const sendNotificationEmail = (appointment, status) => {
  const mailOptions = {
    from: 'dummyrummy44@gmail.com',
    to: appointment.email,
    subject: `Appointment Status Updated to ${status}`,
    text: `Hello ${appointment.firstName},\n\nYour appointment on date ${appointment.appointment_date} has been ${status}.\n\nThank you.`
  };

  console.log('Sending email:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    const updatedFields = req.body;
    const oldStatus = appointment.status;

    console.log('Old Status:', oldStatus);
    console.log('Updated Fields:', updatedFields);

    appointment = await Appointment.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    console.log('Appointment updated:', appointment);

    // Check if the status has been updated and send an email notification
    if (updatedFields.status && updatedFields.status !== oldStatus) {
      console.log('Status changed:', updatedFields.status);
      sendNotificationEmail(appointment, updatedFields.status);
    } else {
      console.log('Status not changed or missing:', updatedFields.status);
    }

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);
// In your appointments controller
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await Appointment.find({ userId });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};




export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
