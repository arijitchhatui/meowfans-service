import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { shake } from 'radash';
import { map, Observable } from 'rxjs';

@Injectable()
export class ShakeInputInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs<Record<string, any>>();

    if (args.input && typeof args.input === 'object') args.input = shake(args.input);
    return next.handle().pipe(map((data) => data));
  }
}
