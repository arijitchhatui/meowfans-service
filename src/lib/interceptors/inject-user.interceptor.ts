import { CallHandler, ContextType, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';

export const VALIDATION_CONTEXT = '_validation_context';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  public constructor(private argName: string) {}

  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<unknown> {
    if (context.getType<ContextType | 'graphql'>() !== 'graphql') return next.handle();

    const ctx = GqlExecutionContext.create(context);
    const argsArg = ctx.getArgByIndex<number>(1);
    const user = ctx.getContext<{ req: Request }>().req.user;

    if (this.argName && argsArg[this.argName]) argsArg[this.argName][VALIDATION_CONTEXT] = { user };

    return next.handle();
  }
}
