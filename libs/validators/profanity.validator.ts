import { profanity } from '@2toad/profanity';
import { ProfanityWarningTypes } from '@app/enums';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'credential', async: true })
export class ProfanityValidator implements ValidatorConstraintInterface {
  public async validate(value: string) {
    const safe = profanity.exists(value);

    return !safe;
  }
  public defaultMessage(validationArguments: ValidationArguments): string {
    switch (validationArguments.property) {
      case 'username':
        return ProfanityWarningTypes.INAPPROPRIATE_USERNAME;
      case 'bio':
        return ProfanityWarningTypes.INAPPROPRIATE_BIO;
      case 'caption':
        return ProfanityWarningTypes.INAPPROPRIATE_CAPTION;
      case 'comment':
        return ProfanityWarningTypes.INAPPROPRIATE_COMMENT;
      default:
        return 'VALIDATION_ERROR';
    }
  }
}
