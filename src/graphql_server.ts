import * as Sentry from '@sentry/node';
import { Request } from 'express';
import * as http from 'http';
import { join } from 'path';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

import { ApolloServer } from '@apollo/server';
import {
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginLandingPageDisabled,
} from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { IResolvers } from '@graphql-tools/utils';
import { ARR_GRAPHQL_ERROR_CODE } from '@storkyle/shared/constants';
import { EEnvironment, EErrorCode } from '@storkyle/shared/enum';
import { IContextGraphql } from '@storkyle/shared/interfaces';
import { getAcceptLanguageFromHeader } from '@storkyle/shared/utilities';
import { DocumentNode, GraphQLFormattedError } from 'graphql';

// *INFO: internal modules

const isProduction = process.env.NODE_ENV === 'production';

const typesArray = loadFilesSync(join(__dirname, 'interface_adapter/graphql/**/*.graphql'), {
  recursive: true,
});
const resolversArray = loadFilesSync(
  join(__dirname, 'interface_adapter/graphql/**/*.resolver{.ts,.js}'),
  {
    recursive: true,
  }
);

export const typeDefs: DocumentNode = mergeTypeDefs(typesArray);
export const resolvers: IResolvers = mergeResolvers(resolversArray);

export const createGraphqlServer = (httpServer: http.Server): ApolloServer<IContextGraphql> => {
  return new ApolloServer<IContextGraphql>({
    schema: buildSubgraphSchema({ typeDefs, resolvers: <any>resolvers }),
    plugins: isProduction
      ? [
          ApolloServerPluginLandingPageDisabled(),
          ApolloServerPluginDrainHttpServer({ httpServer }),
          ApolloServerPluginInlineTraceDisabled(),
        ]
      : [
          ApolloServerPluginDrainHttpServer({ httpServer }),
          ApolloServerPluginInlineTraceDisabled(),
        ],
    formatError: (formattedError: GraphQLFormattedError) => {
      // *INFO: log error to sentry
      // *INFO: only log error when error code is not defined or is INTERNAL_SERVER_ERROR
      // *INFO: only log error when environment is development, staging or production
      const isInErrorCodes = ARR_GRAPHQL_ERROR_CODE.includes(
        <EErrorCode>formattedError.extensions?.code
      );

      if (
        [EEnvironment.STAGING, EEnvironment.PRODUCTION].includes(
          <EEnvironment>process.env.NODE_ENV
        ) &&
        !isInErrorCodes
      ) {
        Sentry.setTags({
          repo: 'core-service',
          'env:': process.env.NODE_ENV || 'development',
        });
        Sentry.captureException({
          errorPath: formattedError.path,
          jsonErrorString: JSON.stringify(formattedError),
        });
      }

      if (process.env.NODE_ENV === EEnvironment.PRODUCTION) {
        const errorCode = isInErrorCodes
          ? formattedError.extensions?.code
          : EErrorCode.INTERNAL_SERVER_ERROR;

        return {
          message: formattedError.message,
          code: errorCode,
          extensions: { code: errorCode },
        };
      }

      return formattedError;
    },
  });
};

export const buildContext = async ({ req, res }: IContextGraphql): Promise<IContextGraphql> => {
  const isAllowRequest =
    <string>req.headers['x-service-token'] !== undefined &&
    <string>req.headers['x-service-token'] === process.env.X_SERVICE_TOKEN;

  return {
    req,
    res,
    lang: getAcceptLanguageFromHeader(<Request>req),
    uid: isAllowRequest ? <string>req.headers.uid : undefined,
    oid: isAllowRequest ? <string>req.headers.oid : undefined,
    internalToken: <string>req.headers['x-service-token'],
  };
};
