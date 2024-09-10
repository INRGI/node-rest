import { IUser } from "./Users.types";
import { User } from "./UsersModel";

export class UsersService{
    async getUserByEmail(email: string):Promise<IUser | null>{
        return User.findOne({email});
    };
    
    async getUserById(id: string):Promise<IUser | null>{
        return User.findById(id);
    }
    
    async addUser(body: Omit<IUser, '_id'>): Promise<IUser>{
        return User.create(body);
    };
    
    async updateUser(id: string, body: Partial<IUser>): Promise<IUser | null>{
        return User.findByIdAndUpdate(id, body);
    }
    
    async verifyUser(token: string, body: Partial<IUser>): Promise<IUser | null>{
        return User.findOneAndUpdate({ verificationToken: token }, body);
    }
};