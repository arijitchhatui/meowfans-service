import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersRepository } from '../../postgres/repositories';
import { ValidationErrorCodes } from 'libs/enums/validation-error-code';

@Injectable()
@ValidatorConstraint({ name: 'email', async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  public constructor(private readonly usersRepository: UsersRepository) {}

  public async validate(email: string) {
    const exists = await this.usersRepository.exists({ where: { email } });

    return !exists;
  }

  public defaultMessage(): string {
    return ValidationErrorCodes.UNIQUE_EMAIL_CONSTRAINT_ERROR;
  }
}
