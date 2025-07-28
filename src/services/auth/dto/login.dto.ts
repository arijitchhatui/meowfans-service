import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginInput {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsNotEmpty()
  password: string;
}
