import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';

export const VALIDATE_CLASS_KEY = 'validateClass';

export function ValidateInput(validator: new (...args: any[]) => ValidatorConstraintInterface) {
  return applyDecorators(SetMetadata(VALIDATE_CLASS_KEY, validator));
}
