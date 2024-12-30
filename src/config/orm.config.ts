import path from 'path';
import { DataSourceOptions } from 'typeorm';

// internal modules
import '_dotenv';

const typeormPath = path.join(__dirname, '..', 'infrastructure/database/typeorm');
const migrationsPath = path.join(typeormPath, 'migrations/*.js');
const entitiesPath = path.join(typeormPath, 'entities/**.entity{.ts,.js}');

const getConfigs = (): DataSourceOptions => {
  const config: any = {
    entities: [entitiesPath],
    logging: process.env.DB_LOGGING === 'true',
    migrations: [migrationsPath.replace('src', 'dist')],
    replication: {},
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    type: 'postgres',
    useUTC: true,
  };

  // *Info: single db
  if (!process.env.DB_MASTER_USERNAME) {
    delete config.replication;

    config.host = process.env.DB_HOST || 'localhost';
    config.port = process.env.DB_PORT || 5432;
    config.username = process.env.DB_USERNAME || '';
    config.password = process.env.DB_PASSWORD || '';
    config.database = process.env.DB_NAME;

    return config;
  }

  // *Info: case use replica db
  if (!!process.env.DB_MASTER_USERNAME) {
    config.replication.master = {
      host: process.env.DB_MASTER_HOST,
      port: process.env.DB_MASTER_PORT,
      username: process.env.DB_MASTER_USERNAME,
      password: process.env.DB_MASTER_PASSWORD,
      database: process.env.DB_MASTER_DBNAME,
    };
  }

  const listSlaves = Object.keys(process.env).filter((el: string) =>
    el.match(/DB_REPLICA_[\d]{1,2}_HOST/g)
  );

  if (listSlaves.length > 0) {
    config.replication.slaves = [];
    for (const item of listSlaves) {
      const index = item.match(/\d\d/g);

      if (index && index[0]) {
        config.replication.slaves.push({
          host: process.env[`DB_REPLICA_${index}_HOST`],
          port: process.env[`DB_REPLICA_${index}_PORT`],
          username: process.env[`DB_REPLICA_${index}_USERNAME`],
          password: process.env[`DB_REPLICA_${index}_PASSWORD`],
          database: process.env[`DB_REPLICA_${index}_DBNAME`],
        });
      }
    }
  }

  return config;
};

export const ormConfig = getConfigs();
