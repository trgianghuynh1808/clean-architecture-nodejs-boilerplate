import { DataSource, DataSourceOptions } from 'typeorm';

// *INFO: internal modules
import { ormConfig } from '@config';

export const AppDataSource = new DataSource(<DataSourceOptions>ormConfig);
