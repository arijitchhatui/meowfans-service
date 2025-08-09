import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PostTypes } from '../../services/service.constants';
import { PostCreationErrorTypes } from '../validation';

@Injectable()
@ValidatorConstraint({ name: 'HasAssetsForExclusiveProp', async: true })
export class HasAssetsForExclusivePropValidator implements ValidatorConstraintInterface {
  private postCreationError = PostCreationErrorTypes.GENERIC_POST_CREATION_ERROR;

  public validate(postTypes: PostTypes[], args: ValidationArguments): boolean {
    const { creatorAssetIds, unlockPrice } = args.object as {
      creatorAssetIds: Array<string>;
      unlockPrice: number;
    };

    if (postTypes.includes(PostTypes.EXCLUSIVE)) {
      if (!creatorAssetIds.length) {
        this.postCreationError = PostCreationErrorTypes.EMPTY_ASSET_IDS_ERROR;
        return false;
      } else if (unlockPrice == null || unlockPrice < 500) {
        this.postCreationError = PostCreationErrorTypes.NULL_UNLOCK_PRICE_FOR_EXCLUSIVE_POST_ERROR;
        return false;
      }
    }

    return true;
  }

  public defaultMessage(): string {
    return this.postCreationError;
  }
}
