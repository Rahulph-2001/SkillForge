import pino from 'pino';
import { env } from './env';

const isProduction = env.NODE_ENV === 'production';

const transport = pino.transport({
  targets: [
    {
      target: 'pino-roll',
      options: {
        file: 'logs/app', 
        frequency: 'daily',
        extension: '.log',
        mkdir: true,
        symlink: false,
      },
      level: 'info',
    },
    ...(isProduction ? [] : [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname', 
        },
        level: 'debug',
      }
    ])
  ]
});

export const logger = pino(
  {
    level: isProduction ? 'info' : 'debug',
    redact: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token'],
  },
  transport
);
