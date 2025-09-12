import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { REMOVE_SPACE_REGEX, USER_NAME_CASE_REGEX } from '../constants';
import { UniqueEmailValidator } from '../validators';

export class CreatorSignupInput {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @Validate(UniqueEmailValidator)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().replace(USER_NAME_CASE_REGEX, ' ').replace(REMOVE_SPACE_REGEX, ' '))
  username: string;
}
