import { BaseRepo as ORMBaseRepo } from '@storkyle/shared/base';
import { plainToInstance } from 'class-transformer';
import { injectable } from 'inversify';

// *INFO: internal modules
import { Example } from '@domain/entities';
import { IExampleRepository } from '@domain/interfaces';
import { AppDataSource } from '../database/typeorm/data_source';
import { ExampleEntity } from '../database/typeorm/entities';

@injectable()
export class ORMExampleRepository extends ORMBaseRepo<ExampleEntity> implements IExampleRepository {
  constructor() {
    super({
      allowSearchFields: ['field'],
      entity: ExampleEntity,
      dataSource: AppDataSource,
    });
  }

  public async findById(id: string): Promise<Example | null> {
    const repo = this.getRepo();
    const entity = await repo
      .createQueryBuilder('example')
      .where('example.id = :id AND removed = false', { id })
      .getOne();

    return entity ? plainToInstance(Example, entity) : null;
  }
}
