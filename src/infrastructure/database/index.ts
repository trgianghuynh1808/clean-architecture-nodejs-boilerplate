import * as ORMDBProvider from './typeorm';
import { RedisProvider } from './redis';

export const registerDBProviders = async () => {
  await ORMDBProvider.connectToDB({ retries: 5 });
  await RedisProvider.initConnection();
};

export { ORMDBProvider, RedisProvider };
