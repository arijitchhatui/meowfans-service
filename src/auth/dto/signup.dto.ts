import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class SignupInput {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string;
}
