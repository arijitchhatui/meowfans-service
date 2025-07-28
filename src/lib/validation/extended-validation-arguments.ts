import { ValidationArguments } from 'class-validator';
import { JwtUser } from '../../services/auth';
import { VALIDATION_CONTEXT } from '../interceptors/inject-user.interceptor';

export interface ExtendedValidationArguments extends ValidationArguments {
  object: ValidationArguments['object'] & {
    [VALIDATION_CONTEXT]: {
      user: JwtUser;
    };
  };
}
