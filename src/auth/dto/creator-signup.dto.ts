import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { UniqueUsernameValidator } from '../../validators';
import { REMOVE_SPACE_REGEX, USER_NAME_CASE_REGEX } from '../constants';

export class CreatorSignupInput {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  region: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().replace(USER_NAME_CASE_REGEX, ' ').replace(REMOVE_SPACE_REGEX, ' '))
  @Validate(UniqueUsernameValidator)
  username: string;
}
