import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Not } from 'typeorm';
import { REMOVE_SPACE_REGEX, USER_NAME_CASE_REGEX } from '../auth';
import { UsersRepository } from '../rdb/repositories';
import { ExtendedValidationArguments, VALIDATION_CONTEXT, ValidationErrorCodes } from '../validation';

@ValidatorConstraint({ name: 'username', async: true })
@Injectable()
export class UniqueUsernameValidator implements ValidatorConstraintInterface {
  public constructor(private readonly userProfilesRepository: UsersRepository) {}

  public async validate(value: string, validationArguments: ExtendedValidationArguments) {
    const currentUserId = validationArguments.object[VALIDATION_CONTEXT].user.sub;

    const newUsername = value.toLowerCase().replace(USER_NAME_CASE_REGEX, '').replace(REMOVE_SPACE_REGEX, '');

    const username = await this.userProfilesRepository.exists({
      where: { username: newUsername, id: Not(currentUserId) },
    });

    return !!username;
  }

  public defaultMessage(): string {
    return ValidationErrorCodes.UNIQUE_CONSTRAINT_ERROR;
  }
}
