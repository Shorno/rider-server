import {Schema, model} from 'mongoose';
import {PaymentMethod, Role, PaymentStatus, RideStatus} from "../../types/shared.types";
import {IRide} from "./ride.interface";


const rideSchema = new Schema<IRide>({
    riderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    pickupLocation: {
        type: String,
        required: true
    },
    destinationLocation: {
        type: String,
        required: true
    },
    estimatedDistance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(RideStatus),
        default: RideStatus.REQUESTED,
        required: true
    },
    fare: {
        baseFare: {type: Number, required: true},
        distanceFare: {type: Number, required: true},
        totalFare: {type: Number, required: true},
        currency: {type: String, default: 'USD'}
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    acceptedAt: Date,
    pickedUpAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelledBy: {
        type: String,
        enum: Object.values(Role),
    },
    cancellationReason: String,
    paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true
    },
    rejectedDrivers: [{
        driverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rejectReason: {
            type: String,
            required: true
        }
    }],
    rating: {
        riderRating: {
            type: Number,
            min: 1,
            max: 5
        },
        driverRating: {
            type: Number,
            min: 1,
            max: 5
        },
        riderComment: String,
        driverComment: String
    }
}, {
    timestamps: true
});

rideSchema.index({riderId: 1, status: 1});
rideSchema.index({driverId: 1, status: 1});

export const Ride = model<IRide>('Ride', rideSchema);