# Rider API Documentation

---

## Project Overview
This project provides a RESTful API for a ride-sharing platform, allowing users to sign up, request rides, and manage their ride history. Drivers can accept or reject ride requests, and admins can manage users and drivers.

## Features
- User registration and authentication
- Driver registration and authentication
- Ride request, acceptance, and cancellation
- Admin management for users and drivers
- JWT-based authentication
- Error handling and validation

## Tech Stack
- **Node.js** with **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Postman** for API testing

---

## Postman Collection
[Live Postman Collection Link](https://documenter.getpostman.com/view/36492185/2sB3BAKX9D)

---

## User Signup

**Endpoint:** `POST /user/signup`

**Request Body:**
```json
{
  "name": "Shorno Kamal Roy",
  "email": "fb.shorno@gmail.com",
  "password": "rider@pass",
  "phone": "01841151827"
}
```

**Sample Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827",
      "role": "rider",
      "isActive": true,
      "isBlocked": false,
      "_id": "688b90c86bc6d2713f5d1bb2",
      "createdAt": "2025-07-31T15:50:32.615Z",
      "updatedAt": "2025-07-31T15:50:32.615Z",
      "__v": 0
    }
  }
}
```

---

## Driver Registration

**Endpoint:** `POST /driver/signup`

**Request Body:**
```json
{
  "name": "Driver Jhon",
  "email": "rider@gmail.com",
  "password": "driver@pass",
  "phone": "01841151825",
  "vehicleType": "car",
  "vehicleModel": "Toyota Corolla",
  "vehiclePlate": "DHA-GA-123",
  "licenseNumber": "DL123456789"
}
```

**Sample Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Driver registered successfully. Pending approval.",
  "data": {
    "user": {
      "name": "Driver Jhon",
      "email": "rider@gmail.com",
      "phone": "01841151825",
      "role": "driver",
      "isActive": true,
      "isBlocked": false,
      "driverInfo": {
        "vehicleType": "car",
        "isApproved": false,
        "isSuspended": false,
        "isOnline": false,
        "totalEarnings": 0,
        "totalRides": 0,
        "rating": 5
      },
      "_id": "688b912e6bc6d2713f5d1bb6",
      "createdAt": "2025-07-31T15:52:14.422Z",
      "updatedAt": "2025-07-31T15:52:14.422Z",
      "__v": 0
    }
  }
}
```

---

## Admin Registration

**Endpoint:** `POST /admin/signup`

**Request Body:**
```json
{
  "name": "Super Admin",
  "email": "admin@gmail.com",
  "password": "admin@pass",
  "phone": "1234567890",
  "adminToken": "secret-admin-token"
}
```

**Sample Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Admin account created successfully",
  "data": {
    "user": {
      "name": "Super Admin",
      "email": "admin@gmail.com",
      "phone": "1234567890",
      "role": "admin",
      "isActive": true,
      "isBlocked": false,
      "_id": "688b913c6bc6d2713f5d1bba",
      "createdAt": "2025-07-31T15:52:28.236Z",
      "updatedAt": "2025-07-31T15:52:28.236Z",
      "__v": 0
    }
  }
}
```

---

## Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin@pass"
}
```

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827",
      "role": "rider",
      "isActive": true,
      "isBlocked": false,
      "createdAt": "2025-07-31T15:50:32.615Z",
      "updatedAt": "2025-07-31T15:50:32.615Z",
      "__v": 0
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Ride Request

**Endpoint:** `POST /ride/request`

**Request Body:**
```json
{
  "pickupLocation": "Savar, Dhaka",
  "destinationLocation": "Mirpur, Dhaka",
  "estimatedDistance": 12,
  "paymentMethod": "cash"
}
```

**Sample Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Ride request created successfully",
  "data": {
    "_id": "688b91796bc6d2713f5d1bbf",
    "riderId": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827"
    },
    "driverId": null,
    "pickupLocation": "Savar, Dhaka",
    "destinationLocation": "Mirpur, Dhaka",
    "estimatedDistance": 12,
    "status": "requested",
    "fare": {
      "baseFare": 50,
      "distanceFare": 180,
      "totalFare": 230,
      "currency": "BDT"
    },
    "requestedAt": "2025-07-31T15:53:29.706Z",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "rejectedDrivers": [],
    "createdAt": "2025-07-31T15:53:29.708Z",
    "updatedAt": "2025-07-31T15:53:29.708Z",
    "__v": 0
  }
}
```

---

## Cancel Ride

**Endpoint:** `PATCH /ride/:rideId/cancel`

**Request Body:**
```json
{
  "cancellationReason": "Change of plans, no longer need the ride"
}
```

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride cancelled successfully",
  "data": {
    "_id": "688b91796bc6d2713f5d1bbf",
    "riderId": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827"
    },
    "driverId": null,
    "pickupLocation": "Savar, Dhaka",
    "destinationLocation": "Mirpur, Dhaka",
    "estimatedDistance": 12,
    "status": "cancelled",
    "fare": {
      "baseFare": 50,
      "distanceFare": 180,
      "totalFare": 230,
      "currency": "BDT"
    },
    "requestedAt": "2025-07-31T15:53:29.706Z",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "rejectedDrivers": [],
    "createdAt": "2025-07-31T15:53:29.708Z",
    "updatedAt": "2025-07-31T15:54:49.162Z",
    "__v": 0,
    "cancellationReason": "Change of plans, no longer need the ride",
    "cancelledAt": "2025-07-31T15:54:49.162Z",
    "cancelledBy": "rider"
  }
}
```

---

## Accept Ride Request

**Endpoint:** `PATCH /ride/:rideId/accept`

**Request Body:**
```json
{
  "action": "accept"
}
```

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride request accepted successfully",
  "data": {
    "_id": "688b9e9d6c2da76171bf0119",
    "riderId": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827"
    },
    "driverId": {
      "_id": "688b912e6bc6d2713f5d1bb6",
      "name": "Driver Jhon",
      "email": "rider@gmail.com",
      "phone": "01841151825"
    },
    "pickupLocation": "Uttora, Dhaka",
    "destinationLocation": "Mirpur, Dhaka",
    "estimatedDistance": 15,
    "status": "accepted",
    "fare": {
      "baseFare": 50,
      "distanceFare": 225,
      "totalFare": 275,
      "currency": "BDT"
    },
    "requestedAt": "2025-07-31T16:49:33.339Z",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "rejectedDrivers": [],
    "createdAt": "2025-07-31T16:49:33.340Z",
    "updatedAt": "2025-07-31T16:51:57.782Z",
    "__v": 0,
    "acceptedAt": "2025-07-31T16:51:57.781Z"
  }
}
```

---

## Reject Ride Request

**Endpoint:** `PATCH /ride/:rideId/reject`

**Request Body:**
```json
{
  "rejectReason": "Going back to home"
}
```

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride request rejected successfully",
  "data": {
    "_id": "688b9e176c2da76171bf0107",
    "riderId": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827"
    },
    "driverId": null,
    "pickupLocation": "Mohammadpur, Dhaka",
    "destinationLocation": "Mirpur, Dhaka",
    "estimatedDistance": 8,
    "status": "requested",
    "fare": {
      "baseFare": 50,
      "distanceFare": 120,
      "totalFare": 170,
      "currency": "BDT"
    },
    "requestedAt": "2025-07-31T16:47:19.912Z",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "rejectedDrivers": [
      {
        "driverId": "688b912e6bc6d2713f5d1bb6",
        "rejectReason": "Going back to home",
        "_id": "688b9e636c2da76171bf010e"
      }
    ],
    "createdAt": "2025-07-31T16:47:19.919Z",
    "updatedAt": "2025-07-31T16:48:35.724Z",
    "__v": 0
  }
}
```

---

## Pickup Ride

**Endpoint:** `PATCH /ride/:rideId/pickup`

**Request Body:**

No body required.

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride picked up successfully",
  "data": {
    "_id": "688b9e9d6c2da76171bf0119",
    "riderId": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827"
    },
    "driverId": {
      "_id": "688b912e6bc6d2713f5d1bb6",
      "name": "Driver Jhon",
      "email": "rider@gmail.com",
      "phone": "01841151825"
    },
    "pickupLocation": "Uttora, Dhaka",
    "destinationLocation": "Mirpur, Dhaka",
    "estimatedDistance": 15,
    "status": "picked_up",
    "fare": {
      "baseFare": 50,
      "distanceFare": 225,
      "totalFare": 275,
      "currency": "BDT"
    },
    "requestedAt": "2025-07-31T16:49:33.339Z",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "rejectedDrivers": [],
    "createdAt": "2025-07-31T16:49:33.340Z",
    "updatedAt": "2025-07-31T16:52:28.470Z",
    "__v": 0,
    "acceptedAt": "2025-07-31T16:51:57.781Z",
    "pickedUpAt": "2025-07-31T16:52:28.469Z"
  }
}
```

---

## Start Ride

**Endpoint:** `PATCH /ride/:rideId/start`

**Request Body:**

No body required.

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride started successfully",
  "data": {
    "_id": "688b9e9d6c2da76171bf0119",
    "riderId": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827"
    },
    "driverId": {
      "_id": "688b912e6bc6d2713f5d1bb6",
      "name": "Driver Jhon",
      "email": "rider@gmail.com",
      "phone": "01841151825"
    },
    "pickupLocation": "Uttora, Dhaka",
    "destinationLocation": "Mirpur, Dhaka",
    "estimatedDistance": 15,
    "status": "in_progress",
    "fare": {
      "baseFare": 50,
      "distanceFare": 225,
      "totalFare": 275,
      "currency": "BDT"
    },
    "requestedAt": "2025-07-31T16:49:33.339Z",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "rejectedDrivers": [],
    "createdAt": "2025-07-31T16:49:33.340Z",
    "updatedAt": "2025-07-31T16:52:54.859Z",
    "__v": 0,
    "acceptedAt": "2025-07-31T16:51:57.781Z",
    "pickedUpAt": "2025-07-31T16:52:54.859Z"
  }
}
```

---

## Complete Ride

**Endpoint:** `PATCH /ride/:rideId/complete`

**Request Body:**

No body required.

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride completed successfully",
  "data": {
    "_id": "688b9e9d6c2da76171bf0119",
    "riderId": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827"
    },
    "driverId": {
      "_id": "688b912e6bc6d2713f5d1bb6",
      "name": "Driver Jhon",
      "email": "rider@gmail.com",
      "phone": "01841151825"
    },
    "pickupLocation": "Uttora, Dhaka",
    "destinationLocation": "Mirpur, Dhaka",
    "estimatedDistance": 15,
    "status": "completed",
    "fare": {
      "baseFare": 50,
      "distanceFare": 225,
      "totalFare": 275,
      "currency": "BDT"
    },
    "requestedAt": "2025-07-31T16:49:33.339Z",
    "paymentStatus": "completed",
    "paymentMethod": "cash",
    "rejectedDrivers": [],
    "createdAt": "2025-07-31T16:49:33.340Z",
    "updatedAt": "2025-07-31T16:53:16.819Z",
    "__v": 0,
    "acceptedAt": "2025-07-31T16:51:57.781Z",
    "pickedUpAt": "2025-07-31T16:52:54.859Z",
    "completedAt": "2025-07-31T16:53:16.818Z"
  }
}
```

---

## Update Driver Availability

**Endpoint:** `PATCH /driver/availability`

**Request Body:**
```json
{
  "isOnline": true
}
```

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Driver availability updated successfully.",
  "data": {
    "_id": "688b912e6bc6d2713f5d1bb6",
    "name": "Driver Jhon",
    "email": "rider@gmail.com",
    "phone": "01841151825",
    "role": "driver",
    "isActive": true,
    "isBlocked": false,
    "driverInfo": {
      "vehicleType": "car",
      "isApproved": true,
      "isSuspended": false,
      "isOnline": true,
      "totalEarnings": 275,
      "totalRides": 1,
      "rating": 5
    },
    "createdAt": "2025-07-31T15:52:14.422Z",
    "updatedAt": "2025-07-31T16:55:36.577Z",
    "__v": 0
  }
}
```

---

## Driver Earnings History

**Endpoint:** `GET /driver/earnings/history`

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Earnings history retrieved successfully.",
  "data": {
    "rides": [
      {
        "rideId": "688b9e9d6c2da76171bf0119",
        "rider": {
          "_id": "688b90c86bc6d2713f5d1bb2",
          "name": "Shorno Kamal Roy",
          "phone": "01841151827"
        },
        "pickupLocation": "Uttora, Dhaka",
        "destinationLocation": "Mirpur, Dhaka",
        "distance": 15,
        "fare": {
          "baseFare": 50,
          "distanceFare": 225,
          "totalFare": 275,
          "currency": "BDT"
        },
        "completedAt": "2025-07-31T16:53:16.818Z",
        "paymentMethod": "cash"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRides": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "summary": {
      "totalEarnings": 275,
      "totalRides": 1,
      "averageFare": 275,
      "totalDistance": 15
    }
  }
}
```

---

## Get All Users (Admin, Full Response)

**Endpoint:** `GET /admin/users`

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "All users fetched successfully",
  "data": [
    {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827",
      "role": "rider",
      "isActive": true,
      "isBlocked": false,
      "createdAt": "2025-07-31T15:50:32.615Z",
      "updatedAt": "2025-07-31T16:49:14.530Z",
      "__v": 0,
      "riderInfo": {
        "cancelCount": 2,
        "preferredPaymentMethod": "cash"
      }
    }
  ]
}
```

---

## Get All Drivers (Admin, Full Response)

**Endpoint:** `GET /admin/drivers`

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "All drivers fetched successfully",
  "data": [
    {
      "_id": "688b912e6bc6d2713f5d1bb6",
      "name": "Driver Jhon",
      "email": "rider@gmail.com",
      "phone": "01841151825",
      "role": "driver",
      "isActive": true,
      "isBlocked": false,
      "driverInfo": {
        "vehicleType": "car",
        "isApproved": true,
        "isSuspended": false,
        "isOnline": true,
        "totalEarnings": 275,
        "totalRides": 1,
        "rating": 5
      },
      "createdAt": "2025-07-31T15:52:14.422Z",
      "updatedAt": "2025-07-31T16:55:36.577Z",
      "__v": 0
    }
  ]
}
```

---

## Get All Rides (Admin, Full Response)

**Endpoint:** `GET /admin/rides`

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "All rides fetched successfully",
  "data": [
    {
      "fare": {
        "baseFare": 50,
        "distanceFare": 180,
        "totalFare": 230,
        "currency": "BDT"
      },
      "_id": "688b91796bc6d2713f5d1bbf",
      "riderId": "688b90c86bc6d2713f5d1bb2",
      "driverId": null,
      "pickupLocation": "Savar, Dhaka",
      "destinationLocation": "Mirpur, Dhaka",
      "estimatedDistance": 12,
      "status": "cancelled",
      "requestedAt": "2025-07-31T15:53:29.706Z",
      "paymentStatus": "pending",
      "paymentMethod": "cash",
      "rejectedDrivers": [],
      "createdAt": "2025-07-31T15:53:29.708Z",
      "updatedAt": "2025-07-31T15:54:49.162Z",
      "__v": 0,
      "cancellationReason": "Change of plans, no longer need the ride",
      "cancelledAt": "2025-07-31T15:54:49.162Z",
      "cancelledBy": "rider"
    },
    {
      "fare": {
        "baseFare": 50,
        "distanceFare": 120,
        "totalFare": 170,
        "currency": "BDT"
      },
      "_id": "688b9e176c2da76171bf0107",
      "riderId": "688b90c86bc6d2713f5d1bb2",
      "driverId": null,
      "pickupLocation": "Mohammadpur, Dhaka",
      "destinationLocation": "Mirpur, Dhaka",
      "estimatedDistance": 8,
      "status": "cancelled",
      "requestedAt": "2025-07-31T16:47:19.912Z",
      "paymentStatus": "pending",
      "paymentMethod": "cash",
      "rejectedDrivers": [
        {
          "driverId": "688b912e6bc6d2713f5d1bb6",
          "rejectReason": "Going back to home",
          "_id": "688b9e636c2da76171bf010e"
        }
      ],
      "createdAt": "2025-07-31T16:47:19.919Z",
      "updatedAt": "2025-07-31T16:49:14.409Z",
      "__v": 0,
      "cancellationReason": "Change of plans, no longer need the ride",
      "cancelledAt": "2025-07-31T16:49:14.409Z",
      "cancelledBy": "rider"
    },
    {
      "fare": {
        "baseFare": 50,
        "distanceFare": 225,
        "totalFare": 275,
        "currency": "BDT"
      },
      "_id": "688b9e9d6c2da76171bf0119",
      "riderId": "688b90c86bc6d2713f5d1bb2",
      "driverId": "688b912e6bc6d2713f5d1bb6",
      "pickupLocation": "Uttora, Dhaka",
      "destinationLocation": "Mirpur, Dhaka",
      "estimatedDistance": 15,
      "status": "completed",
      "requestedAt": "2025-07-31T16:49:33.339Z",
      "paymentStatus": "completed",
      "paymentMethod": "cash",
      "rejectedDrivers": [],
      "createdAt": "2025-07-31T16:49:33.340Z",
      "updatedAt": "2025-07-31T16:53:16.819Z",
      "__v": 0,
      "acceptedAt": "2025-07-31T16:51:57.781Z",
      "pickedUpAt": "2025-07-31T16:52:54.859Z",
      "completedAt": "2025-07-31T16:53:16.818Z"
    }
  ]
}
```

---

## Update Driver Status (Admin)

**Endpoint:** `PATCH /admin/drivers/:driverId/status`

**Request Body:**
```json
{
  "action": "approve"
}
```

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Driver status updated successfully",
  "data": {
    "driver": {
      "_id": "688b912e6bc6d2713f5d1bb6",
      "name": "Driver Jhon",
      "email": "rider@gmail.com",
      "phone": "01841151825",
      "role": "driver",
      "isActive": true,
      "isBlocked": false,
      "driverInfo": {
        "vehicleType": "car",
        "isApproved": true,
        "isSuspended": false,
        "isOnline": false,
        "totalEarnings": 0,
        "totalRides": 0,
        "rating": 5
      },
      "createdAt": "2025-07-31T15:52:14.422Z",
      "updatedAt": "2025-07-31T16:45:53.778Z",
      "__v": 0
    }
  }
}
```

---

## Update User Status (Admin)

**Endpoint:** `PATCH /admin/users/:userId/status`

**Request Body:**
```json
{
  "action": "block"
}
```

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "user": {
      "_id": "688b90c86bc6d2713f5d1bb2",
      "name": "Shorno Kamal Roy",
      "email": "fb.shorno@gmail.com",
      "phone": "01841151827",
      "role": "rider",
      "isActive": true,
      "isBlocked": true,
      "createdAt": "2025-07-31T15:50:32.615Z",
      "updatedAt": "2025-07-31T16:58:54.957Z",
      "__v": 0,
      "riderInfo": {
        "cancelCount": 2,
        "preferredPaymentMethod": "cash"
      }
    }
  }
}
```

---

## Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Sample Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "<new_access_token>",
    "refreshToken": "<new_refresh_token>"
  }
}
```

---
