import {User} from '../models/userModels.js';

export async function getUserByEmail(email){
    return User.findOne({email});
};

export async function getUserById(id){
    return User.findById(id);
}

export async function addUser(body){
    return User.create(body);
};

export async function updateUser(id, body){
    return User.findByIdAndUpdate(id, body);
}

export async function verifyUser(token, body){
    return User.findOneAndUpdate(token, body);
}
