import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getUserAppointments
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isstudentAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isstudentAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.get('/appointment/user/:id', isstudentAuthenticated, getUserAppointments);

export default router;
