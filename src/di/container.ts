import { Container } from 'inversify';
import 'reflect-metadata';

// *INFO: internal modules
import { GetExampleDetailsUseCase } from '@application/use_cases';
import { ORMExampleRepository } from '@infrastructure/repositories';
import { ExampleController } from '@interface_adapter/controllers';
import { TAGS, TYPES } from './types';

export function createContainer(): Container {
  const container = new Container();

  // *INFO: binding Controller
  container.bind<ExampleController>(TYPES.ExampleController).to(ExampleController);

  // *INFO: binding Repositories
  container
    .bind<ORMExampleRepository>(TYPES.ExampleRepository)
    .to(ORMExampleRepository)
    .whenTargetNamed(TAGS.ExampleRepository.ORM);

  // *INFO: binding Use Cases
  container
    .bind<GetExampleDetailsUseCase>(TYPES.ExampleUseCase)
    .to(GetExampleDetailsUseCase)
    .whenTargetNamed(TAGS.ExampleUseCase.GetExampleDetails);

  return container;
}

export const container = createContainer();
