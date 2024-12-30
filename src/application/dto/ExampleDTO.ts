import { IsNotEmpty, IsString } from 'class-validator';

// *INFO: internal modules

export class BaseExampleDTO {
  @IsString()
  @IsNotEmpty()
  field: string;
}

export class CreateExampleDTO extends BaseExampleDTO {
  @IsString()
  @IsNotEmpty()
  field1: string;
}

export class EditExampleDTO implements Partial<BaseExampleDTO> {}
