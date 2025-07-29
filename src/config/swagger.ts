export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Rider App API',
    version: '1.0.0',
    description: 'API documentation for the Rider App backend service',
    contact: {
      name: 'API Support',
      email: 'fb.shorno@gmail.com'
    }
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'User ID'
          },
          name: {
            type: 'string',
            description: 'User name',
            minLength: 2,
            maxLength: 50
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          phone: {
            type: 'string',
            pattern: '^[0-9]{10,15}$',
            description: 'User phone number'
          },
          role: {
            type: 'string',
            enum: ['admin', 'rider', 'driver'],
            description: 'User role'
          },
          isActive: {
            type: 'boolean',
            description: 'Whether user is active'
          },
          isBlocked: {
            type: 'boolean',
            description: 'Whether user is blocked'
          }
        },
        required: ['name', 'email', 'password', 'phone']
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 50
          },
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 6
          },
          phone: {
            type: 'string',
            pattern: '^[0-9]{10,15}$'
          },
          role: {
            type: 'string',
            enum: ['rider', 'driver', 'admin'],
            default: 'rider'
          }
        },
        required: ['name', 'email', 'password', 'phone']
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string'
          }
        },
        required: ['email', 'password']
      },
      ResetPasswordRequest: {
        type: 'object',
        properties: {
          oldPassword: {
            type: 'string'
          },
          newPassword: {
            type: 'string',
            minLength: 6
          }
        },
        required: ['oldPassword', 'newPassword']
      },
      CreateDriverRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 50
          },
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 6
          },
          phone: {
            type: 'string',
            pattern: '^[0-9]{10,15}$'
          },
          vehicleType: {
            type: 'string',
            enum: ['car', 'bike', 'auto']
          },
          vehicleModel: {
            type: 'string'
          },
          vehiclePlate: {
            type: 'string'
          },
          licenseNumber: {
            type: 'string'
          }
        },
        required: ['name', 'email', 'password', 'phone', 'vehicleType', 'vehicleModel', 'vehiclePlate', 'licenseNumber']
      },
      CreateAdminRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 50
          },
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 6
          },
          phone: {
            type: 'string',
            pattern: '^[0-9]{10,15}$'
          }
        },
        required: ['name', 'email', 'password', 'phone']
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          message: {
            type: 'string'
          },
          data: {
            type: 'object'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string'
          },
          error: {
            type: 'object'
          }
        }
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate user with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          400: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        description: 'Get new access token using refresh token',
        responses: {
          200: {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          401: {
            description: 'Invalid refresh token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'User logout',
        description: 'Logout user and invalidate tokens',
        responses: {
          200: {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password',
        description: 'Reset user password',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResetPasswordRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Password reset successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized or invalid old password',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/user/signup': {
      post: {
        tags: ['Users'],
        summary: 'Create new user',
        description: 'Register a new user (rider)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/user/{userId}': {
      patch: {
        tags: ['Users'],
        summary: 'Update user',
        description: 'Update user information',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'User ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  phone: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/driver/signup': {
      post: {
        tags: ['Drivers'],
        summary: 'Create new driver',
        description: 'Register a new driver with vehicle information',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateDriverRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Driver created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/driver': {
      get: {
        tags: ['Drivers'],
        summary: 'Get all drivers',
        description: 'Retrieve list of all drivers',
        responses: {
          200: {
            description: 'Drivers retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean'
                    },
                    message: {
                      type: 'string'
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/signup': {
      post: {
        tags: ['Admin'],
        summary: 'Create new admin',
        description: 'Register a new admin user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateAdminRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Admin created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  }
};
