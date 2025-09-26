import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class MeowFansMiddleware implements NestMiddleware {
  private logger = new Logger(MeowFansMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    res.on('finish', () => {
      if (req.originalUrl === '/graphql') this.graphqlLogger(req, res, startTime);
      else this.expressLogger(req, res, startTime);
    });
    next();
  }

  private async expressLogger(req: Request, res: Response, startTime: number) {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const responseTime = Date.now() - startTime;
    const userId = req.user?.sub ?? '0x0';
    const remoteAddr = this.formatIP(this.getClientIp(req));

    const logMessage = [`${statusCode} ${originalUrl}`, `${responseTime}ms - ${remoteAddr}`, `${userId}`].join(' ');
    const logType = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'debug';
    this.logger[logType](logMessage, method);
  }

  private async graphqlLogger(req: Request, res: Response, startTime: number) {
    const { statusCode } = res;
    const responseTime = Date.now() - startTime;
    const remoteAddr = this.formatIP(this.getClientIp(req));
    const userId = req.user?.sub ?? '0x0';

    const logMessage = [
      `${statusCode} ${req.body?.operationName || req.originalUrl}`,
      `${responseTime}ms - ${remoteAddr}`,
      `${userId}`,
    ].join(' ');

    const logType = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'debug';
    this.logger[logType](logMessage, 'GRAPHQL');
  }

  private formatIP(ip?: string) {
    if (ip === '::1') return 'localhost';
    return ip || 'invalid-ip';
  }

  private getClientIp(req: Request): string {
    return (req.headers['cf-connecting-ip'] || req.ip) as string;
  }
}
