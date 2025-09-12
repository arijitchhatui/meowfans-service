import { Injectable, PipeTransform } from '@nestjs/common';
import { omit } from 'radash';
import { VALIDATION_CONTEXT } from '../interceptors/inject-user.interceptor';

@Injectable()
export class StripValidationContextPipe implements PipeTransform {
  public transform(value: object) {
    return typeof value === 'object' && VALIDATION_CONTEXT in value ? omit(value, [VALIDATION_CONTEXT]) : value;
  }
}
