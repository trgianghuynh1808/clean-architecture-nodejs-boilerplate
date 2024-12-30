import { Request, Response } from 'express';
import { inject, injectable, named } from 'inversify';

// *INFO: internal modules
import { GetExampleDetailsUseCase } from '@application/use_cases';
import { TAGS, TYPES } from '@di/types';

@injectable()
export class ExampleController {
  private readonly getExampleDetailsUseCase: GetExampleDetailsUseCase;

  constructor(
    @inject(TYPES.ExampleUseCase)
    @named(TAGS.ExampleUseCase.GetExampleDetails)
    getExampleDetailsUseCase: GetExampleDetailsUseCase
  ) {
    this.getExampleDetailsUseCase = getExampleDetailsUseCase;
  }

  public async getDetails(req: Request, res: Response) {
    const { id } = req.params;

    const entity = await this.getExampleDetailsUseCase.execute(id);

    if (!entity) {
      return res.status(404).json({ error: 'entity not found' });
    }

    return res.json(entity);
  }
}
