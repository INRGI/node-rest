import { Document } from "mongoose";

export interface IUser extends Document {
    password: string;
    email: string;
    subscription?: "starter"| "pro" | "business";
    token?: string;
    avatarURL?: string;
    verify?: boolean;
    verificationToken: string;
}