import { Schema, model } from "mongoose";
import { IContact } from "./Contacts.types";

const contactSchema = new Schema<IContact>(
    {
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
          required: [true, 'Set email for contact'],
          unique: true,
        },
        phone: {
          type: String,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        },    
      },
      {
        versionKey: false,
      }
);

export const Contact = model<IContact>('contact', contactSchema);