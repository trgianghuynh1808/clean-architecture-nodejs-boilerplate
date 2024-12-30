import { combineResolvers } from '@storkyle/shared/libs';
import { castBoolean } from '@storkyle/shared/utilities';

// *INFO: internal modules
import { GetExampleDetailsUseCase } from '@application/use_cases';
import { container } from '@di/container';
import { TAGS, TYPES } from '@di/types';

export default {
  Query: {
    get_details: combineResolvers(async (_: any, { id }: any, ___: any) => {
      const getDetailsUseCase = container.getNamed<GetExampleDetailsUseCase>(
        TYPES.ExampleUseCase,
        TAGS.ExampleUseCase.GetExampleDetails
      );

      const instance = await getDetailsUseCase.execute(id);

      return castBoolean(instance);
    }),
  },
};
