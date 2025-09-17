import { GraphqlErrorCodes } from '@app/enums';
import { UserInputError } from '@nestjs/apollo';
import { ValidationError, ValidationPipe } from '@nestjs/common';

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
