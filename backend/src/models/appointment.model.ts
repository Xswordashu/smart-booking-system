//// appointment.model.ts
import { Schema, model, Types } from "mongoose";

const appointmentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    slot: {
      type: Types.ObjectId,
      ref: "Slot",
      required: true,
      unique: true, // 🚨 ensures one booking per slot
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: String,
    endTime: String,

    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED",
    },
  },
  { timestamps: true }
);

// 🚨 Enforce 1 appointment per user per day
appointmentSchema.index(
  { user: 1, date: 1 },
  { unique: true }
);

export const Appointment = model("Appointment", appointmentSchema);