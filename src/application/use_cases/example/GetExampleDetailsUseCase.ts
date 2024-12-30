import { inject, injectable, named } from 'inversify';

// *INFO: internal modules
import { TAGS, TYPES } from '@di/types';
import { Example } from '@domain/entities';
import { IExampleRepository } from '@domain/interfaces';

@injectable()
export class GetExampleDetailsUseCase {
  private readonly repository: IExampleRepository;

  constructor(
    @inject(TYPES.ExampleRepository)
    @named(TAGS.ExampleRepository.ORM)
    repository: IExampleRepository
  ) {
    this.repository = repository;
  }

  public async execute(id: string): Promise<Example | null> {
    const entity = await this.repository.findById(id);

    return entity;
  }
}
