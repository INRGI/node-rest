import {Contact} from '../models/contactModels.js';

export async function listContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findById(contactId);
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export async function addContact(body) {
  return Contact.create(body);
}

export async function updatingContact(contactId, body) {
  return Contact.findByIdAndUpdate(contactId, body, {new: true});
}

export async function updateStatusById(contactId, body){
  return Contact.findByIdAndUpdate(contactId, body, {new: true})
}