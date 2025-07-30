import {User} from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {CreateDriverInput, UpdateDriverAvailabilityInput} from "./driver.validation";
import {Role} from "../../types/shared.types";


export const createDriverService = async (payload: CreateDriverInput) => {
    const {
        name,
        email,
        password,
        phone,
        vehicleType,
        isActive,
        isBlocked
    } = payload;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this email address.')
    }

    const existingPhone = await User.findOne({phone});
    if (existingPhone) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this phone number.')
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const driverData = {
        name,
        email,
        password: hashedPassword,
        phone,
        role: Role.DRIVER,
        isActive,
        isBlocked,
        driverInfo: {
            vehicleType,
            isApproved: false,
            isSuspended: false,
            isOnline: false,
            totalEarnings: 0,
            totalRides: 0,
            rating: 5,
        }
    };

    const newDriver = await User.create(driverData);
    const driverObject = newDriver.toObject();
    const {password: _, ...driverWithoutPassword} = driverObject;
    return {
        user: driverWithoutPassword
    };
}


export const updateDriverAvailabilityService = async (driverId: string, payload: UpdateDriverAvailabilityInput) => {


    const driver = await User.findByIdAndUpdate(
        driverId,
        {'driverInfo.isOnline': payload.isOnline},
        {new: true}
    );

    if (!driver) {
        throw new AppError(httpStatus.NOT_FOUND, 'Driver not found');
    }

    return driver;
};
