import { IEventPayload } from '@storkyle/shared/interfaces';

// *INFO: internal import
import { IExampleEventPayload } from '../../interfaces';

export async function exampleHandler(
  _eventPayload: IEventPayload<IExampleEventPayload>
): Promise<void> {
  // *INFO: handle handler in here
}
