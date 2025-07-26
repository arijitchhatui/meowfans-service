import { ValidationArguments } from 'class-validator';
import { JwtUser } from '../auth';

export const VALIDATION_CONTEXT = '_validation_context';

export interface ExtendedValidationArguments extends ValidationArguments {
  object: ValidationArguments['object'] & {
    [VALIDATION_CONTEXT]: {
      user: JwtUser;
    };
  };
}
