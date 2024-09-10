import Contacts from "./contacts/Contacts";
import Users from "./users/Users";

type Controller = typeof Users | typeof Contacts;

const controllers = <Controller[]>[Users, Contacts];

export {controllers};