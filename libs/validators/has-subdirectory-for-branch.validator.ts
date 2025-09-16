import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CreateScrapeInput } from 'src/services/scraper/dto/create-scrape.dto';

@Injectable()
@ValidatorConstraint({ name: 'HasSubdirectoryForBranch', async: true })
export class HasSubdirectoryForBranch implements ValidatorConstraintInterface {
  public validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    const { subDirectory, hasBranch } = validationArguments?.object as CreateScrapeInput;

    if (hasBranch && !subDirectory) return false;

    return true;
  }

  public defaultMessage(): string {
    return "Sub directory can't be empty for branches!";
  }
}
