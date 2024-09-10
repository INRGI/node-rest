import { Contact } from "./ContactsModel";
import { IContact } from "./Contacts.types";
import { ApiError } from "helpers/ApiError";

export class ContactsService{
  async listContacts(): Promise<IContact[]> {
    return Contact.find();
  }
  
  async getContactById(
    contactId: string
  ): Promise<IContact | null> {
    return Contact.findById(contactId);
  }
  
  async removeContact(
    contactId: string
  ): Promise<IContact | null> {
    return Contact.findByIdAndDelete(contactId);
  }
  
  async addContact(
    body: Omit<IContact, "_id">
  ): Promise<IContact> {
    const existingContact = await Contact.findOne({ email: body.email });
  
    if (existingContact) {
      throw new ApiError(409, {
        message: "Contact already exists",
        code: "CONTACT_ALREADY_EXISTS",
      });
    }
  
    return Contact.create(body);
  }
  
  async updatingContact(
    contactId: string,
    body: Partial<IContact>
  ): Promise<IContact | null> {
    return Contact.findByIdAndUpdate(contactId, body, { new: true });
  }
  
  async updateStatusById(
    contactId: string,
    body: Partial<IContact>
  ): Promise<IContact | null> {
    return Contact.findByIdAndUpdate(contactId, body, { new: true });
  }
}