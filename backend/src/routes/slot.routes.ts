import { Router } from "express";
import { SlotController } from "../controllers/slot.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Get slots by date
router.get("/", SlotController.getSlots);

// Book appointment
router.post("/appointments/book", authMiddleware, SlotController.bookAppointmentController);

// Cancel appointment
router.post("/appointments/:id/cancel", authMiddleware, SlotController.cancelAppointmentController);

// Get logged-in user's appointments
router.get("/appointments/my", authMiddleware, SlotController.getMyAppointments);

export default router;