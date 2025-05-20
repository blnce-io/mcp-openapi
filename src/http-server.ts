import { bootstrapHttpServer } from './infra/http-server';
import * as logger from './infra/logger';
import { initMcpServer } from './mcp-server';
import { populateSpecsDirectory } from './populate-specs-dir';

(async () => {
  await populateSpecsDirectory();
  initMcpServer();
  await bootstrapHttpServer();
})().catch((error) => {
  logger.error(error);
  process.exit(1);
});
