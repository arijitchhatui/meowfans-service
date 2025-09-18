import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CreateImportInput } from '../../src/services/import/dto/create-import.dto';

@Injectable()
@ValidatorConstraint({ name: 'HasSubdirectoryForBranch', async: true })
export class HasSubdirectoryForBranch implements ValidatorConstraintInterface {
  public validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    const { subDirectory, hasBranch } = validationArguments?.object as CreateImportInput;

    if (hasBranch && !subDirectory) return false;

    return true;
  }

  public defaultMessage(): string {
    return "Sub directory can't be empty for branches!";
  }
}
