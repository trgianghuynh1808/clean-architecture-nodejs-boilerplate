import { plainToInstance } from 'class-transformer';

// *INFO: internal modules
import { BaseExampleDTO } from '@application/dto';
import { Example } from '@domain/entities';

export class UserMapper {
  public toEntity(payload: BaseExampleDTO): Example {
    return plainToInstance(Example, payload);
  }

  public toDTO(entity: Example): BaseExampleDTO {
    return plainToInstance(BaseExampleDTO, entity);
  }
}
