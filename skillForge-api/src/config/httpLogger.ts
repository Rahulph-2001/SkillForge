import pinoHttp from 'pino-http';
import { logger } from './logger';
import { type SerializedRequest, type SerializedResponse } from 'pino';

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
    if (res.statusCode >= 500 || err) return 'error';
    return 'info';
  },
  serializers: {
    req: (req: SerializedRequest) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
    }),
    res: (res: SerializedResponse) => ({
      statusCode: res.statusCode,
    })
  },
  autoLogging: {
    ignore: (req) => req.url === '/health'
  }
});
