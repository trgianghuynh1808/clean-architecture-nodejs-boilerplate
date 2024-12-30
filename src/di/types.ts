export const TYPES = {
  // *INFO: Repository
  ExampleRepository: Symbol.for('ExampleRepository'),

  // *INFO: UseCase
  ExampleUseCase: Symbol.for('ExampleUseCase'),

  // *INFO: Controller
  ExampleController: Symbol.for('ExampleController'),
};

export const TAGS = {
  // *INFO: Repository
  ExampleRepository: {
    ORM: Symbol.for('ORMExampleRepository'),
  },
  // *INFO: UseCase

  ExampleUseCase: {
    GetExampleDetails: Symbol.for('GetExampleDetailsUseCase'),
  },
};
