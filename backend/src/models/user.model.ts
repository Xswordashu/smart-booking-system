// user.model.ts
import { Schema, model, Types, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // security
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);