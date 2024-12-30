// internal modules
import { ExternalService } from './__external_service';

const EXAMPLE_DOMAIN: string = 'http://localhost:5555';

interface IExampleResponse {}

class _ExampleExternalService extends ExternalService {
  constructor() {
    super({ domain: EXAMPLE_DOMAIN });
  }

  public async example(payload: unknown): Promise<boolean> {
    const { data, status } = await this.fetchData<IExampleResponse>('/api/example', { payload });

    if (!status) {
      return false;
    }

    return (data as boolean) ?? false;
  }
}

export const ExampleExternalService = new _ExampleExternalService();
