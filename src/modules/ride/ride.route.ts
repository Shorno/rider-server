import express from 'express';
import { RideController } from './ride.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createRideRequestZodSchema, cancelRideZodSchema, rateRideZodSchema, rejectRideZodSchema } from './ride.validation';
import {checkAuth} from "../../middlewares/checkAuth";
import {Role} from "../../types/shared.types";


const router = express.Router();

//Rider actions

router.post(
    '/request',
    validateRequest(createRideRequestZodSchema),
    checkAuth(...Object.values(Role)),
    RideController.createRideRequest
);

router.patch(
    '/:rideId/cancel',
    validateRequest(cancelRideZodSchema),
    checkAuth(...Object.values(Role)),
    RideController.cancelRide
);


// Driver actions

router.patch(
    "/:rideId/accept",
    checkAuth(Role.DRIVER),
    RideController.acceptRideRequest
);

router.patch(
    "/:rideId/reject",
    validateRequest(rejectRideZodSchema),
    checkAuth(Role.DRIVER),
    RideController.rejectRideRequest
);

router.patch(
    "/:rideId/pickup",
    checkAuth(Role.DRIVER),
    RideController.pickUpRide
);

// Add the remaining status endpoints
router.patch(
    "/:rideId/start",
    checkAuth(Role.DRIVER),
    RideController.startRide
);

router.patch(
    "/:rideId/complete",
    checkAuth(Role.DRIVER),
    RideController.completeRide
);


router.get('/history', RideController.getRideHistory);

router.patch(
    '/:rideId/rate',
    validateRequest(rateRideZodSchema),
    RideController.rateRide
);

export const RideRoutes = router;
