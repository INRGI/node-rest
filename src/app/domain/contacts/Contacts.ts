import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from "routing-controllers";
import { IContact } from "./Contacts.types";
import { ApiError } from "helpers/ApiError";
import { Authenticate } from "app/middlewares/Authenticate";
import { validateBody } from "helpers/validateBody";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "schemas/contactsSchema";
import { ContactsService } from "./ContactsService";
import { IsValidId } from "app/middlewares/IsValidId";

const contactService = new ContactsService();

@JsonController("/contacts")
@UseBefore(Authenticate)
export default class Contacts {
  @Get("/")
  async getAllContacts(): Promise<IContact[]> {
    return contactService.listContacts();
  }

  @UseBefore(IsValidId)
  @Get("/:id")
  @HttpCode(201)
  async getOneContact(@Param("id") id: string): Promise<IContact> {
    const result = await contactService.getContactById(id);
    if (!result) throw new ApiError(404, { message: "Contact not found!" });

    return result;
  }

  @UseBefore(validateBody(createContactSchema))
  @Post("/")
  async createContact(@Body() body: Omit<IContact, "_id">): Promise<IContact> {
    return contactService.addContact(body);
  }

  @UseBefore(IsValidId)
  @Delete("/:id")
  async deleteContact(@Param("id") id: string): Promise<IContact> {
    const result = await contactService.removeContact(id);
    if (!result) throw new ApiError(404, { message: "Contact not found!" });

    return result;
  }

  @UseBefore(validateBody(updateContactSchema))
  @UseBefore(IsValidId)
  @Put("/:id")
  async updateContact(
    @Param("id") id: string,
    @Body() body: Partial<IContact>
  ): Promise<IContact> {
    if (Object.keys(body).length === 0)
      throw new ApiError(400, { message: "Body must have at least one field" });

    const result = await contactService.updatingContact(id, body);
    if (!result) throw new ApiError(404, { message: "Contact not found!" });

    return result;
  }

  @UseBefore(validateBody(updateContactStatusSchema))
  @UseBefore(IsValidId)
  @Put("/:id/favorite")
  async updateContactStatus(
    @Param("id") id: string,
    @Body() body: Partial<IContact>
  ): Promise<IContact> {
    if (Object.keys(body).length === 0)
      throw new ApiError(400, { message: "Body must have at least one field" });

    const result = await contactService.updateStatusById(id, body);
    if (!result) throw new ApiError(404, { message: "Contact not found!" });

    return result;
  }
}
