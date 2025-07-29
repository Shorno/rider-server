import {User} from "../user/user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import {CreateAdminInput} from "./admin.validation";
import {env} from "../../config/env";
import {Role} from "../user/user.interface";

export const adminSignupService = async (payload: CreateAdminInput) => {
    const {name, email, password, phone, adminToken, permissions} = payload;

    if (adminToken !== env.ADMIN_TOKEN) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid admin token.');
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this email address.');
    }

    const existingPhone = await User.findOne({phone});
    if (existingPhone) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this phone number.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = {
        name,
        email,
        password: hashedPassword,
        phone,
        role: Role.ADMIN,
        isActive: true,
        isBlocked: false,
        adminInfo: {
            permissions,
            lastLogin: new Date()
        }
    };

    const newAdmin = await User.create(adminData);
    const adminObject = newAdmin.toObject();
    const {password: _, ...adminWithoutPassword} = adminObject;


    return {
        user: adminWithoutPassword,
    };
};
