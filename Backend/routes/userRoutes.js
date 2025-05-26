import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  //getAllUsers,
  deleteUser,
} from "../controllers/userControllers.js";
import { authGuard } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authGuard, userProfile);
router.put("/updateProfile/:userId", authGuard, updateProfile);
router.put("/updateProfilePicture", authGuard, updateProfilePicture);
//add put password for update password
//router.get("/", authGuard, getAllUsers);
router.delete("/:userId", authGuard, deleteUser);

export default router;