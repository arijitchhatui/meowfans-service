import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'HasAssetsForExclusiveProp', async: true })
export class HasAssetsForExclusivePropValidator implements ValidatorConstraintInterface {
  public validate(isExclusive: boolean, args: ValidationArguments): boolean {
    const { assetIds } = args.object as { assetIds: Array<string> };

    return isExclusive && !assetIds ? false : true;
  }

  public defaultMessage(): string {
    return "Assets can't be empty for exclusive messages!";
  }
}
