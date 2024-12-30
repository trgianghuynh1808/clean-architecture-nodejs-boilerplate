// *INFO: internal modules
import { sleep } from '@shared/utilities';
import { AppDataSource } from './data_source';

const initialize = async () =>
  AppDataSource.initialize()
    .then(() => {
      console.info('---> Data Source has been initialized!');
    })
    .catch((err: Error) => {
      console.error(err, 'Error during Data Source initialization');
      throw err;
    });

export const connectToDB = async ({ retries = 5 }: { retries: number }) => {
  while (retries) {
    try {
      await initialize();
      break;
    } catch (err) {
      retries -= 1;
      console.info(`retries left: ${retries}`);
      await sleep(5000); // wait 5 seconds before retry again
    }
  }
  if (retries === 0) {
    process.exit();
  }
};
