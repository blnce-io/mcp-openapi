import { bootstrapHttpServer } from './infra/http-server';
import * as logger from './infra/logger';
import { initMcpServer } from './mcp-server';

initMcpServer();
bootstrapHttpServer().catch(error => {
  logger.error(error);
  process.exit(1);
})
