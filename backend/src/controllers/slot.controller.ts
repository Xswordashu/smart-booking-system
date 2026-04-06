import { Request, Response } from "express";
import { SlotService } from "../services/slot.service";

export class SlotController {
  static async getSlots(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date || typeof date !== "string") {
        return res.status(400).json({
          success: false,
          message: "Date parameter is required and must be a string"
        });
      }

      // Validate YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({
          success: false,
          message: "Date must be in YYYY-MM-DD format"
        });
      }

      const slots = await SlotService.getSlotsByDate(date);

      res.json({
        success: true,
        data: slots
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async bookAppointmentController(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      const { slotId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User must be authenticated"
        });
      }

      if (!slotId || typeof slotId !== "string") {
        return res.status(400).json({
          success: false,
          message: "slotId is required"
        });
      }

      const appointment = await SlotService.bookAppointment(userId, slotId);

      return res.json({
        success: true,
        data: appointment
      });
    } catch (error: any) {
      const statusCode = error.message?.includes("not found") || error.message?.includes("already") || error.message?.includes("past") || error.message?.includes("Invalid")
        ? 400
        : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to book appointment"
      });
    }
  }

  static async getMyAppointments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User must be authenticated"
        });
      }

      const appointments = await SlotService.getUserAppointments(userId);

      return res.json({
        success: true,
        data: appointments
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch appointments"
      });
    }
  }

  static async cancelAppointmentController(req: Request, res: Response) {
    try {
      const appointmentId = req.params.id;
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User must be authenticated"
        });
      }

      if (!appointmentId || typeof appointmentId !== "string") {
        return res.status(400).json({
          success: false,
          message: "appointmentId is required"
        });
      }

      const appointment = await SlotService.cancelAppointment(appointmentId, userId);

      return res.json({
        success: true,
        data: appointment
      });
    } catch (error: any) {
      const statusCode = error.message?.includes("not found") || error.message?.includes("already") || error.message?.includes("not authorized") || error.message?.includes("Cannot cancel") || error.message?.includes("Invalid")
        ? 400
        : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to cancel appointment"
      });
    }
  }
}