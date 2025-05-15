import path from 'path';
import type { SpecServiceConfig } from './core/interfaces/ISpecService';
import { McpService } from './McpService';
import { ConsoleLogger } from './core/Logger';
import { FileSystemSpecService } from './core/SpecService';
import { DefaultSpecScanner } from './core/SpecScanner';
import { DefaultSpecProcessor } from './core/SpecProcessor';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getConfig } from './infra/config';

let server: McpServer | null = null;

export function initMcpServer(): void {
  const specServiceConfig: SpecServiceConfig = {
    basePath: getConfig('OPENAPI_SPECS_DIRECTORY') || path.join(process.cwd(), 'openapi-specs'),
    catalogDir: '_catalog',
    dereferencedDir: '_dereferenced',
    retryAttempts: 3,
    retryDelay: 1000,
    cache: {
      maxSize: 1000,
      ttl: 60 * 60 * 1000, // 1 hour
    },
  };
  const logger = new ConsoleLogger();
  const specService = new FileSystemSpecService(
    new DefaultSpecScanner(new DefaultSpecProcessor()),
    specServiceConfig,
    logger,
  );
  server = new McpService(specService).createServer();
}

export function getServer(): McpServer {
  if (!server) {
    throw new Error('MCP server not initialized yet!');
  }
  return server;
}
