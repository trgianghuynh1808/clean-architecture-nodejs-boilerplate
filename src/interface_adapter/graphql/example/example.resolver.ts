// *INFO: internal modules
import { GetExampleDetailsUseCase } from '@application/use_cases';
import { container } from '@di/container';
import { TAGS, TYPES } from '@di/types';
import { Example } from '@domain/entities';

export default {
  Example: {
    __resolveReference: async (parent: Example) => {
      const getExampleDetailsUseCase = container.getNamed<GetExampleDetailsUseCase>(
        TYPES.ExampleUseCase,
        TAGS.ExampleUseCase.GetExampleDetails
      );

      return await getExampleDetailsUseCase.execute(parent.id);
    },
  },
};
