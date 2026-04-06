// slot.model.ts
import { Schema, model, Types } from "mongoose";

const slotSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String, // "10:00"
      required: true,
    },
    endTime: {
      type: String, // "10:30"
      required: true,
    },

    isBooked: {
      type: Boolean,
      default: false,
      index: true,
    },

    bookedBy: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate slots
slotSchema.index(
  { date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export const Slot = model("Slot", slotSchema);