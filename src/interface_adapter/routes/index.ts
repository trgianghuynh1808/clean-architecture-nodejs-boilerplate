import express, { Request, Response } from 'express';

// *INFO: internal modules
import { AppEventEmitter } from '@application/events';
import { getBuildVersion } from '@shared/helpers';
import { verifyRequestMiddleware } from '../middlewares';
import exampleRoutes, { ExampleRoutes } from './ExampleRoutes';

export type TExpressRoute = {
  path: string;
  method: string;
  handler: (req: Request, res: Response) => void;
  middleware?: Function[];
  validation?: Function[];
};

interface IEvent {
  event_name?: string;
  payload?: any;
}

class RouterFactory {
  constructor(private readonly exampleRoutes: ExampleRoutes) {}

  create(): TExpressRoute[] {
    return [
      ...this.exampleRoutes.getRoutes(),
      {
        path: '/hook/event',
        method: 'POST',
        handler: (req: Request, res: Response) => {
          const { event_name, payload }: IEvent = req.body;
          if (!event_name) return res.sendStatus(400);

          AppEventEmitter.emit(event_name, payload);

          return res.sendStatus(200);
        },
        middleware: [verifyRequestMiddleware],
      },
      {
        path: '/.version',
        method: 'GET',
        handler: (_req: Request, res: Response) => {
          res.send(getBuildVersion());
        },
      },
    ];
  }
}

const routes = new RouterFactory(exampleRoutes).create();

export function setupRoutes(app: express.Application): void {
  routes.forEach((route) => {
    const middleware = route.middleware || [];
    const validation = route.validation || [];

    app[route.method.toLowerCase() as keyof express.Application](
      route.path,
      ...middleware,
      ...validation,
      route.handler
    );
  });
}
