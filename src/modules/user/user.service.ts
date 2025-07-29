import {IUser} from "./user.interface";
import {User} from "./user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {JwtPayload} from "jsonwebtoken";
import {CreateUserInput} from "./user.validation";

export const createUserService = async (payload: CreateUserInput) => {
    const {name, email, password, phone, role, isActive, isBlocked} = payload;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this email address.')
    }

    const existingPhone = await User.findOne({phone});
    if (existingPhone) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this phone number.')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        isActive,
        isBlocked,
    };
    const newUser = await User.create(userData);
    const userObject = newUser.toObject();
    const {password: _, ...userWithoutPassword} = userObject;
    return {
        user: userWithoutPassword
    }
}


export const getAllUsersService = async () => {
    const users = await User.find();

    const totalUsers = await User.countDocuments();

    return {
        data: users,
        metadata: {
            total: totalUsers
        }
    }
}


export const updateUserService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }


    return User.findByIdAndUpdate(userId, payload, {new: true});

}
