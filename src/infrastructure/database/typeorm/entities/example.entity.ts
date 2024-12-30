import { BaseEntity } from '@storkyle/shared/base';
import { Column, Entity } from 'typeorm';

// *INFO: internal modules
import { EExampleType } from '@domain/enums';

@Entity({ name: 'example', schema: 'example-schema' })
export class ExampleEntity extends BaseEntity {
  // *INFO: Info fields
  @Column({ nullable: false })
  field: string;

  @Column({ type: 'int', default: EExampleType.TYPE_1 })
  type: EExampleType;
}
