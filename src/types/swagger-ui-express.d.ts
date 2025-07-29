declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  interface SwaggerUiOptions {
    explorer?: boolean;
    customCss?: string;
    customSiteTitle?: string;
    swaggerOptions?: {
      persistAuthorization?: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export const serve: RequestHandler[];
  export function setup(swaggerDoc: any, options?: SwaggerUiOptions): RequestHandler;
}
