import { NextFunction, Request, Response } from 'express';

const IS_MICROSERVICE = process.env.RUN_AS_MICRO_SERVICE === 'true';
const X_SERVICE_TOKEN = process.env.X_SERVICE_TOKEN || '';

export const verifyRequestMiddleware = (req: Request, res: Response, nextFunc: NextFunction) => {
  const isAllowRequest = IS_MICROSERVICE
    ? req.headers['x-service-token'] !== undefined &&
      req.headers['x-service-token'] === X_SERVICE_TOKEN
    : true;

  return isAllowRequest ? nextFunc() : res.status(403).send('');
};
