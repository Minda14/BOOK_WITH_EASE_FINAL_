import express from "express";
import {
  addNewAdmin,
  
  addNewlocation,
  getMe,
  getAlllocations,
  getUserDetails,
  login,
  logoutAdmin,
  logoutstudent,
  studentRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isstudentAuthenticated,
  
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/student/register", studentRegister);
router.post("/login", login);
router.post("/admin/addnew",  addNewAdmin);
router.post("/location/addnew", isAdminAuthenticated, addNewlocation);
router.get("/locations", getAlllocations);
router.get('/me',isstudentAuthenticated,getMe);


router.get("/student/me", isstudentAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/student/logout", isstudentAuthenticated, logoutstudent);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router;
