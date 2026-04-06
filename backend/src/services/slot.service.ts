import mongoose, { Types } from "mongoose";
import { Slot } from "../models/slot.model";
import { Appointment } from "../models/appointment.model";

export class SlotService {
  static async getSlotsByDate(dateString: string) {
    // Validate and parse date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    // Normalize to start of day (00:00:00)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Query slots for the date, sort by startTime, select specific fields
    const slots = await Slot.find({ date: normalizedDate })
      .sort({ startTime: 1 })
      .select("_id startTime endTime isBooked");

    return slots;
  }

  static async getUserAppointments(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const appointments = await Appointment.find({
      user: new Types.ObjectId(userId),
    })
      .sort({ date: -1 })
      .select("_id date startTime endTime status");

    return appointments;
  }

  static async cancelAppointment(appointmentId: string, userId: string) {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new Error("Invalid appointment ID");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const session = await mongoose.startSession();
    let updatedAppointment = null;

    try {
      await session.withTransaction(async () => {
        const appointment = await Appointment.findById(appointmentId).session(session);
        if (!appointment) {
          throw new Error("Appointment not found");
        }

        if (appointment.status === "CANCELLED") {
          throw new Error("Appointment is already cancelled");
        }

        if (!appointment.user.equals(new Types.ObjectId(userId))) {
          throw new Error("User not authorized to cancel this appointment");
        }

        if (!appointment.startTime || typeof appointment.startTime !== "string") {
          throw new Error("Appointment start time is invalid");
        }

        const appointmentStart = new Date(appointment.date);
        const [hours, minutes] = appointment.startTime.split(":").map(Number);
        appointmentStart.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const diffMs = appointmentStart.getTime() - now.getTime();
        if (diffMs <= 60 * 60 * 1000) {
          throw new Error("Cannot cancel within 60 minutes");
        }

        const slot = await Slot.findById(appointment.slot).session(session);
        if (!slot) {
          throw new Error("Associated slot not found");
        }

        appointment.status = "CANCELLED";
        await appointment.save({ session });

        slot.isBooked = false;
        slot.bookedBy = null;
        await slot.save({ session });

        updatedAppointment = appointment;
      });

      return updatedAppointment;
    } finally {
      session.endSession();
    }
  }

  static async bookAppointment(userId: string, slotId: string) {
    if (!Types.ObjectId.isValid(slotId)) {
      throw new Error("Invalid slot ID");
    }

    const session = await mongoose.startSession();
    let createdAppointment = null;

    try {
      await session.withTransaction(async () => {
        const slot = await Slot.findById(slotId).session(session);
        if (!slot) {
          throw new Error("Slot not found");
        }

        if (slot.isBooked) {
          throw new Error("Slot is already booked");
        }

        const slotDate = new Date(slot.date);
        slotDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (slotDate < today) {
          throw new Error("Slot date is in the past");
        }

        const existingAppointment = await Appointment.findOne({
          user: new Types.ObjectId(userId),
          date: slotDate,
        }).session(session);

        if (existingAppointment) {
          throw new Error("User already has an appointment for this date");
        }

        slot.isBooked = true;
        slot.bookedBy = new Types.ObjectId(userId);
        await slot.save({ session });

        const [appointment] = await Appointment.create(
          [
            {
              user: new Types.ObjectId(userId),
              slot: slot._id,
              date: slotDate,
              startTime: slot.startTime,
              endTime: slot.endTime,
            },
          ],
          { session }
        );

        createdAppointment = appointment;
      });

      return createdAppointment;
    } finally {
      session.endSession();
    }
  }
}