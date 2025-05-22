import express from 'express';
import type { Request, Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { getServer } from './mcp-server';
import { asyncWrapper } from './infra/async-wrapper';
import * as logger from './infra/logger';
import { randomUUID } from 'crypto';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

const router = express.Router();

const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

router.post(
  '/mcp',
  asyncWrapper(async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      logger.log('MCP transport accepted - already exists');
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      logger.log('MCP transport - created');
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => (transports[sessionId] = transport),
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };

      const server = getServer();
      await server.connect(transport);
    } else {
      logger.log('MCP transport - rejected, bad session');
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    logger.log('MCP transport - handling');
    await transport.handleRequest(req, res, req.body);
  }),
);

const handleSessionRequest = async (req: Request, res: Response) => {
  logger.log('Incoming ' + req.method + ' request', { body: req.body }); // TODO: Remove this
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    logger.log('MCP session - rejected, bad session');
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  logger.log('MCP session - accepted');
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

router.get(
  '/mcp',
  asyncWrapper(async (req: Request, res: Response) => handleSessionRequest(req, res)),
);

router.delete(
  '/mcp',
  asyncWrapper(async (req: Request, res: Response) => handleSessionRequest(req, res)),
);

router.get('/', (request, response) => {
  response.status(200).send();
});

export default router;
