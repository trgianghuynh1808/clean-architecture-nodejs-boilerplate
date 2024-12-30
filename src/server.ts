import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import * as Sentry from '@sentry/node';
import { IContextGraphql } from '@storkyle/shared/interfaces';
import cors from 'cors';
import express from 'express';
import * as http from 'http';
import morgan from 'morgan';
import { join } from 'path';
import { createStream } from 'rotating-file-stream';

// *INFO: internal modules
import { AppEventEmitter } from '@application/events';
import { registerDBProviders } from '@infrastructure/database';
import { verifyRequestMiddleware } from '@interface_adapter/middlewares';
import { setupRoutes } from '@interface_adapter/routes';
import { logger } from '@sentry/utils';
import { i18nRouter } from '@shared/helpers';
import { buildContext, createGraphqlServer } from './graphql_server';

const isProduction = process.env.NODE_ENV === 'production';
const createAccessLogStream = () =>
  createStream('access.log', {
    interval: '2h',
    path: join(__dirname, '..', 'logs', 'access'),
  });

interface IAppConstructor {
  httpServer: http.Server;
  graphqlServer: ApolloServer<IContextGraphql>;
}

export class App {
  private httpServer: http.Server;
  private graphqlServer: ApolloServer<IContextGraphql>;

  public async start(host: string, port: number): Promise<IAppConstructor> {
    const app = express();
    this.httpServer = http.createServer(app);

    this._registerProviders();
    this._registerEvent();
    this._setupSentry(app);
    this._setupMiddleware(app);
    await this._setupGraphQL(app);
    this._setupRoutes(app);

    this._startServer(host, port);

    return { httpServer: this.httpServer, graphqlServer: this.graphqlServer };
  }

  private _setupSentry(app: express.Application): void {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        // *INFO: enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0,
    });

    // *INFO: The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());
    // *INFO: TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  }

  private _setupMiddleware(app: express.Application): void {
    app.disable('x-powered-by');
    app.use(
      isProduction ? morgan('combined', { stream: createAccessLogStream() }) : morgan('dev'),
      i18nRouter,
      express.json({ limit: '50mb' })
    );
  }

  private async _setupGraphQL(app: express.Application): Promise<void> {
    this.graphqlServer = createGraphqlServer(this.httpServer);
    await this.graphqlServer.start();

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      verifyRequestMiddleware,
      expressMiddleware(this.graphqlServer, {
        context: buildContext,
      })
    );
  }

  private _setupRoutes(app: express.Application): void {
    setupRoutes(app);
  }

  private _registerEvent(): void {
    AppEventEmitter.register();
  }

  private _startServer(host: string, port: number): void {
    this.httpServer.listen(port, host, () => {
      logger.info(`Running at: http://${host}:${port}`);
    });
  }

  private async _registerProviders(): Promise<void> {
    await registerDBProviders();
  }
}
