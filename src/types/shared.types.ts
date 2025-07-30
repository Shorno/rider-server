
export enum Role {
    ADMIN = 'admin',
    RIDER = 'rider',
    DRIVER = 'driver'
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    WALLET = 'wallet'
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

export enum RideStatus {
    REQUESTED = 'requested',
    ACCEPTED = 'accepted',
    PICKED_UP = 'picked_up',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum VehicleType {
    CAR = 'car',
    BIKE = 'bike',
    AUTO = 'auto'
}


