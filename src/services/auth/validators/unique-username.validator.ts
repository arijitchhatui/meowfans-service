import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Not } from 'typeorm';
import { REMOVE_SPACE_REGEX, USER_NAME_CASE_REGEX } from '..';
import { UsersRepository } from '../../postgres/repositories';
import { ExtendedValidationArguments } from '@app/validation';
import { VALIDATION_CONTEXT } from '@app/interceptors';
import { ValidationErrorCodes } from 'libs/enums/validation-error-code';

@Injectable()
@ValidatorConstraint({ name: 'username', async: true })
export class UniqueUsernameValidator implements ValidatorConstraintInterface {
  public constructor(private readonly userProfilesRepository: UsersRepository) {}

  public async validate(value: string, args: ExtendedValidationArguments) {
    const newUsername = value.toLowerCase().replace(USER_NAME_CASE_REGEX, ' ').replace(REMOVE_SPACE_REGEX, ' ');
    const currentUserId = args.object[VALIDATION_CONTEXT].user.sub;

    const exists = await this.userProfilesRepository.exists({
      where: { username: newUsername, id: Not(currentUserId) },
    });

    return !exists;
  }

  public defaultMessage(): string {
    return ValidationErrorCodes.UNIQUE_USERNAME_CONSTRAINT_ERROR;
  }
}
