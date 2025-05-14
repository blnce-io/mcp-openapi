import express from "express";
import type { Request, Response } from 'express';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { getServer } from './mcp-server';
import { asyncWrapper } from './infra/async-wrapper'
import * as logger from './infra/logger';

const router = express.Router();

router.post('/mcp', asyncWrapper(async (req, res) => {
  const server = getServer(); 
  const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on('close', () => {
    logger.log('Request closed');
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}));

router.get('/mcp', asyncWrapper(async (req: Request, res: Response) => {
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32601,
      message: "Method not allowed."
    },
    id: null
  }));
}));

router.delete('/mcp', asyncWrapper(async (req: Request, res: Response) => {
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32601,
      message: "Method not allowed."
    },
    id: null
  }));
}));

router.get("/", (request, response) => {
  response.status(200).send();
});

export default router;