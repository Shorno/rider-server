import mongoose, {Schema} from 'mongoose';
import { IUser } from "./user.interface";
import { Role, PaymentMethod, VehicleType } from "../../types/shared.types";


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,
    },

    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
    },

    role: {
        type: String,
        enum: Object.values(Role),
        required: [true, 'Role is required'],
        default: Role.RIDER
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    driverInfo: {
        type: {
            vehicleType: {type: String, enum: Object.values(VehicleType)},
            isApproved: {type: Boolean, default: false},
            isSuspended: {type: Boolean, default: false},
            isOnline: {type: Boolean, default: false},
            totalEarnings: {type: Number, default: 0},
            totalRides: {type: Number, default: 0},
            rating: {type: Number, default: 5, min: 1, max: 5},
            currentLocation: {
                latitude: {type: Number, min: -90, max: 90},
                longitude: {type: Number, min: -180, max: 180}
            },
        },
        _id: false
    },

    riderInfo: {
        type: {
            cancelCount: {type: Number, default: 0},
            lastCancelDate: {type: Date},
            preferredPaymentMethod: {type: String, enum: Object.values(PaymentMethod), default: PaymentMethod.CASH}
        },
        _id: false
    }
}, {
    timestamps: true
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ role: 1 });

userSchema.index({
    role: 1,
    'driverInfo.isOnline': 1,
    'driverInfo.isApproved': 1
});

userSchema.index({
    'driverInfo.isOnline': 1
});

export const User = mongoose.model<IUser>('User', userSchema);
export default User;

// ['manage_users', 'manage_drivers', 'manage_rides', 'view_reports']
