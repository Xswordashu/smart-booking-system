// scripts/generateSlots.ts

import mongoose from "mongoose";
import { Slot } from "../models/slot.model";
import dotenv from "dotenv";

dotenv.config();

const SLOT_DURATION = 30; // minutes
const START_TIME = "09:00";
const END_TIME = "17:00";

const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minutes);
  return date.toTimeString().slice(0, 5);
};

const generateSlotsForDate = async (date: Date) => {
  let currentTime = START_TIME;

  const slots = [];

  while (currentTime < END_TIME) {
    const nextTime = addMinutes(currentTime, SLOT_DURATION);

    if (nextTime > END_TIME) break;

    slots.push({
      date,
      startTime: currentTime,
      endTime: nextTime,
    });

    currentTime = nextTime;
  }

  try {
    await Slot.insertMany(slots, { ordered: false });
    console.log(`✅ Slots created for ${date.toDateString()}`);
  } catch (error: any) {
    console.log("⚠️ Some slots already exist (ignored)");
  }
};

const generateSlots = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const startDate = new Date();
  const daysToGenerate = 7;

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date();
    date.setDate(startDate.getDate() + i);
    date.setHours(0, 0, 0, 0); // normalize date

    await generateSlotsForDate(date);
  }

  console.log("🎉 Slot generation completed");
  process.exit(0);
};

generateSlots();