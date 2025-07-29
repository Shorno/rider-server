import {User} from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {CreateDriverInput} from "./driver.validation";
import {Role} from "../user/user.interface";

export const createDriverService = async (payload: CreateDriverInput) => {
    const {
        name,
        email,
        password,
        phone,
        vehicleType,
        vehicleModel,
        vehiclePlate,
        licenseNumber,
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

    const existingPlate = await User.findOne({"driverInfo.vehiclePlate": vehiclePlate});
    if (existingPlate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Vehicle with this plate number already exists.')
    }

    const existingLicense = await User.findOne({"driverInfo.licenseNumber": licenseNumber});
    if (existingLicense) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Driver with this license number already exists.')
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
            vehicleModel,
            vehiclePlate,
            licenseNumber,
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

export const getAllDriversService = async () => {
    const drivers = await User.find({role: Role.DRIVER});
    const totalDrivers = await User.countDocuments({role: Role.DRIVER});

    return {
        data: drivers,
        metadata: {
            total: totalDrivers
        }
    }
}
