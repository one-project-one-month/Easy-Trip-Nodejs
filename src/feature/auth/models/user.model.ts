import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  googleId: string;
  provider: "local" | "google";
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    provider: {
      type: String,
      default: "local",
      enum: ["local", "google"],
      required: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === "local"; // Only required if provider is 'local'
      },
    },
    googleId: {
      type: String,
      required: function (this: IUser) {
        return this.provider === "google"; // Only required if provider is 'google'
      },
    },
    refreshToken: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    lastLogout: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
