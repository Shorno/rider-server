import {User} from "../user/user.model";
import {Ride} from "../ride/ride.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import {CreateAdminInput, UpdateDriverStatusInput, UpdateUserStatusInput} from "./admin.validation";
import {env} from "../../config/env";
import {Role} from "../../types/shared.types";

export const adminSignupService = async (payload: CreateAdminInput) => {
    const {name, email, password, phone, adminToken} = payload;

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
    };

    const newAdmin = await User.create(adminData);
    const adminObject = newAdmin.toObject();
    const {password: _, ...adminWithoutPassword} = adminObject;


    return {
        user: adminWithoutPassword,
    };
};

export const getAllUsersService = async () => {
    return User.find({role: Role.RIDER});
};

export const getAllDriversService = async () => {
    return User.find({role: Role.DRIVER});
};

export const getAllRidesService = async () => {
    return Ride.find();
};


export const updateDriverStatusService = async (driverId: string, payload: UpdateDriverStatusInput) => {
    if (!driverId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Driver ID is required.');
    }
    const {action} = payload

    let updateFields: Partial<{
        'driverInfo.isApproved': boolean;
        'driverInfo.isSuspended': boolean;
        'driverInfo.isOnline': boolean;
    }> = {};

    switch (action) {
        case 'approve':
            updateFields = {'driverInfo.isApproved': true, 'driverInfo.isSuspended': false};
            break;
        case 'suspend':
            updateFields = {'driverInfo.isSuspended': true, 'driverInfo.isApproved': false};
            break;
        case 'activate':
            updateFields = {'driverInfo.isOnline': true};
            break;
        default:
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid action specified.');
    }

    const updatedDriver = await User.findByIdAndUpdate(
        driverId,
        {$set: updateFields},
        {new: true, runValidators: true}
    );

    if (!updatedDriver) {
        throw new AppError(httpStatus.NOT_FOUND, 'Driver not found.');
    }

    const driverObject = updatedDriver.toObject();
    const {password: _, ...driverWithoutPassword} = driverObject;
    return {
        driver: driverWithoutPassword,
    };
}


export const updateUserStatusService = async (userId: string, payload: UpdateUserStatusInput) => {
    if (!userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User ID is required.');
    }
    const {action} = payload;

    let updateFields: Partial<{
        isBlocked: boolean;
    }> = {};

    switch (action) {
        case 'block':
            updateFields = {isBlocked: true};
            break;
        case 'unblock':
            updateFields = {isBlocked: false};
            break;
        default:
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid action specified.');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {$set: updateFields},
        {new: true, runValidators: true}
    );

    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    const userObject = updatedUser.toObject();
    const {password: _, ...userWithoutPassword} = userObject;
    return {
        user: userWithoutPassword,
    };
};