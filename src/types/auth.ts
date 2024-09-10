import { IUser } from 'app/domain/users/Users.types';
import { Request } from 'express';

export interface AuthenticateRequest extends Request{
    user?: IUser;
}