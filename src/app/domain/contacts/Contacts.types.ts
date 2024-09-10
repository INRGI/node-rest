import { Document, Schema } from "mongoose";

export interface IContact extends Document{
    name: string;
    email: string;
    phone?: string;
    favorite?: boolean;
    owner?: Schema.Types.ObjectId;
}