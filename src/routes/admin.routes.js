
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import identifyRole from "../middleware/identifyRole.js";

import {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/instructors/pending",
  verifyToken,
  identifyRole("admin"),
  getPendingInstructors
);

router.patch(
  "/instructors/:userId/approve",
  verifyToken,
  identifyRole("admin"),
  approveInstructor
);

router.patch(
  "/instructors/:userId/reject",
  verifyToken,
  identifyRole("admin"),
  rejectInstructor
);

export default router;
