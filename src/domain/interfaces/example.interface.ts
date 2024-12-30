// *INFO: internal modules
import { Example } from '../entities';

export interface IExampleRepository {
  findById(id: string): Promise<Example | null>;
}
