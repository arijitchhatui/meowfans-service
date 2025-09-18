import { UserInputError } from '@nestjs/apollo';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { GraphqlErrorCodes } from '../../src/util/enums';

export class ExtendedGraphqlValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors: ValidationError[]): UserInputError => {
        return new UserInputError(GraphqlErrorCodes.VALIDATION_ERROR, {
          extensions: { invalidArgs: errors },
        });
      },
    });
  }
}
