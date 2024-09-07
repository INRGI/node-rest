import {addContact, getContactById, listContacts, removeContact, updateStatusById, updatingContact} from "../services/contactsServices.js";
import {catchAsync} from '../helpers/catchAsync.js';
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = catchAsync(async (req, res) => {
    const result = await listContacts();
    res.json(result);
});

export const getOneContact = catchAsync(async (req, res) => {
    const {id} = req.params;
    const result = await getContactById(id);
    if(!result) throw HttpError(404);

    res.json(result);
});

export const deleteContact = catchAsync(async (req, res) => {
    const {id} = req.params;
    const result = await removeContact(id);
    if(!result) throw HttpError(404);

    res.json(result);
});

export const createContact = catchAsync(async (req, res) => {
    const result = await addContact(req.body);

    res.status(201).json(result);
});

export const updateContact = catchAsync(async (req, res) => {
    const {id} = req.params;

    if(Object.keys(req.body).length === 0) throw HttpError(400, 'Body must have at least one field');

    const result = await updatingContact(id, req.body);

    if(!result) throw HttpError(404);

    res.status(200).json(result);
});

export const updateContactStatus = catchAsync(async (req, res) => {
    const {id} = req.params;

    if(Object.keys(req.body).length === 0) throw HttpError(400, 'Body must have at least one field');

    const result = await updateStatusById(id, req.body);

    if(!result) throw HttpError(404);

    res.status(200).json(result);
});