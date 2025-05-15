import express from 'express';
import type { Express } from 'express';
import bodyParser from 'body-parser';
import type { AddressInfo } from 'net';
import * as logger from './logger.ts';
import { errorTrapMiddleware } from './error-trap';
import { requestIdMiddleware } from './request-id.ts';
import router from '../http-router';
import type { Server } from 'http';
import { requestLogger } from './request-logger.ts';
import { corsMiddleware } from './cors';
import { securityHeadersMiddleware } from './security-headers';
import { getConfig } from './config.ts';

let app: Express;
let server: Server;

export async function bootstrapHttpServer(): Promise<void> {
  const defaultPort = 3000;
  app = express();

  app.use(corsMiddleware);
  app.use(securityHeadersMiddleware);
  app.use(bodyParser.json());
  app.use(requestIdMiddleware);
  app.use(requestLogger);
  app.use(router);
  app.use(errorTrapMiddleware);

  server = app.listen(getConfig('PORT') || defaultPort, () =>
    logger.log('HTTP Server is listening on port ' + (server.address() as AddressInfo).port),
  );
}
