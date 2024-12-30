import { Request, Response } from 'express';

// *INFO: internal modules
import { container } from '@di/container';
import { TYPES } from '@di/types';
import { TExpressRoute } from '.';
import { ExampleController } from '../controllers';

export class ExampleRoutes {
  private readonly basePath: string;

  constructor() {
    this.basePath = '/api/example';
  }

  public getRoutes(): TExpressRoute[] {
    const exampleController = container.get<ExampleController>(TYPES.ExampleController);

    return [
      {
        path: `${this.basePath}/:id/detail`,
        method: 'POST',
        handler: (req: Request, res: Response) => exampleController.getDetails(req, res),
      },
    ];
  }
}

const exampleRoutes = new ExampleRoutes();

export default exampleRoutes;
