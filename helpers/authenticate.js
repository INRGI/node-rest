import 'dotenv/config';
import jwt from 'jsonwebtoken';
import HttpError from './HttpError.js';
import { getUserById } from '../services/usersServices.js';


const {SECRET_KEY} = process.env;

export const authenticate = async(req, res, next)=>{
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");

    if(bearer !== "Bearer") next(HttpError(401));

    try{
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await getUserById(id);

        if(!user || !user.token || user.token !== token) return next(HttpError(401));

        req.user = user;
        next()
    } catch (err){
        next(HttpError(401));
    }
}