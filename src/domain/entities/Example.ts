import { EExampleType } from '@domain/enums';
import { BaseEntity } from './__base_entity';

export type TProperties = Record<string, unknown>;

export class Example extends BaseEntity {
  public readonly field: string;
  public readonly type: EExampleType;

  constructor(
    payload: Partial<Example> & {
      id: string;
      filed: string;
    }
  ) {
    super();

    Object.assign(this, {
      ...payload,
      // *INFO: default values
      type: EExampleType.TYPE_1,
    });
  }
}
