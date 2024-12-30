// load environment variables
import './_dotenv';
import '@di/container';
// external modules
import { ApolloServer } from '@apollo/server';
import { Server } from 'http';

// internal modules
import { logger } from '@shared/helpers';
import { loadBuildVersion } from '@shared/helpers';
import { App } from './server';

const port: number = parseInt(process.env.NODE_PORT || '') || 4029;
const host = process.env.NODE_HOST || 'localhost';

const app: any = {};

async function gracefulExit() {
  const {
    httpServer,
    publisher,
    subscriber,
    graphqlServer,
  }: { httpServer: Server; graphqlServer: ApolloServer; publisher: any; subscriber: any } = app;

  if (publisher) publisher.disconnect();
  if (subscriber) subscriber.disconnect();
  if (graphqlServer) graphqlServer.stop();
  if (httpServer) httpServer.close();

  process.exit(0);
}

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, gracefulExit);
});

logger.info('Starting application...');
logger.info(`---> ENV: ${process.env.NODE_ENV}`);
loadBuildVersion();

const expressApp = new App();
expressApp
  .start(host, port)
  .then(() => {
    Object.assign(app, expressApp);
  })
  .catch((error: any) => {
    throw error;
  });
