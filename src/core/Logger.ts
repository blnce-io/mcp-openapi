import * as logger from '../infra/logger';

interface LogContext {
  [key: string]: unknown;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  debug(context: LogContext, message: string): void;
  info(message: string, context?: LogContext): void;
  info(context: LogContext, message: string): void;
  warn(message: string, context?: LogContext): void;
  warn(context: LogContext, message: string): void;
  error(message: string, context?: LogContext): void;
  error(context: LogContext, message: string): void;
}

export class ConsoleLogger implements Logger {
  private log(level: string, messageOrContext: string | LogContext, contextOrMessage?: LogContext | string) {
    let message: string;
    let context: LogContext | undefined;

    if (typeof messageOrContext === 'string') {
      message = messageOrContext;
      context = contextOrMessage as LogContext;
    } else {
      message = contextOrMessage as string;
      context = messageOrContext;
    }

    if (level === 'ERROR') {
      logger.error(message, { level: level.toLowerCase(), ...context });
    } else {
      logger.log(message, { level: level.toLowerCase(), ...context });
    }
  }

  debug(messageOrContext: string | LogContext, contextOrMessage?: LogContext | string) {
    this.log('DEBUG', messageOrContext, contextOrMessage);
  }

  info(messageOrContext: string | LogContext, contextOrMessage?: LogContext | string) {
    this.log('INFO', messageOrContext, contextOrMessage);
  }

  warn(messageOrContext: string | LogContext, contextOrMessage?: LogContext | string) {
    this.log('WARN', messageOrContext, contextOrMessage);
  }

  error(messageOrContext: string | LogContext, contextOrMessage?: LogContext | string) {
    this.log('ERROR', messageOrContext, contextOrMessage);
  }
}
