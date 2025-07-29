import mongoose, {Schema} from 'mongoose';
import {IUser, PaymentMethod, Role, VehicleType} from "./user.interface";


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
            vehicleModel: {type: String},
            vehiclePlate: {type: String, unique: true, sparse: true},
            licenseNumber: {type: String, unique: true, sparse: true},
            isApproved: {type: Boolean, default: false},
            isSuspended: {type: Boolean, default: false},
            isOnline: {type: Boolean, default: false},
            currentLocation: {
                latitude: {type: Number, min: -90, max: 90},
                longitude: {type: Number, min: -180, max: 180}
            },
            totalEarnings: {type: Number, default: 0},
            totalRides: {type: Number, default: 0},
            rating: {type: Number, min: 1, max: 5},
            currentRideId: {type: Schema.Types.ObjectId, ref: 'Ride', default: null},
        },
        _id: false
    },

    riderInfo: {
        type: {
            totalRides: {type: Number, default: 0},
            currentRideId: {type: Schema.Types.ObjectId, ref: 'Ride', default: null},
            cancelCount: {type: Number, default: 0},
            lastCancelDate: {type: Date},
            preferredPaymentMethod: {type: String, enum: Object.values(PaymentMethod), default: PaymentMethod.CASH}
        },
        _id: false
    },

    adminInfo: {
        type: {
            permissions: [{type: String}],
            lastLogin: {type: Date}
        },
        _id: false
    }
}, {
    timestamps: true
});

userSchema.index({ email: 1 }, { name: 'idx_user_email', unique: true });
userSchema.index({ phone: 1 }, { name: 'idx_user_phone', unique: true });
userSchema.index({ role: 1 }, { name: 'idx_user_role' });

export const User = mongoose.model<IUser>('User', userSchema);
export default User;

// ['manage_users', 'manage_drivers', 'manage_rides', 'view_reports']
