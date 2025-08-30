import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { InjectUserInterceptor } from '../interceptors/inject-user.interceptor';
import { StripValidationContextPipe } from '../pipes/strip-validation-context.pipe';

export function InjectUserToArg(argName: string): MethodDecorator & ClassDecorator {
  return applyDecorators(UseInterceptors(new InjectUserInterceptor(argName)), UsePipes(StripValidationContextPipe));
}
