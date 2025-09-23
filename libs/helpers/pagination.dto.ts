import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AssetType, PostTypes, SortOrder } from '../../src/util/enums';
import { DownloadStates } from '../../src/util/enums/download-state';

@InputType()
export class PaginationInput {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { defaultValue: 0, nullable: true })
  offset: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { defaultValue: 30, nullable: true })
  limit: number;

  @IsEnum(SortOrder)
  @Field(() => String, { defaultValue: SortOrder.DESC, nullable: true })
  orderBy: SortOrder;

  @Field(() => ID, { nullable: true })
  relatedEntityId?: string;

  @Field(() => ID, { nullable: true })
  relatedUserId?: string;

  @Field(() => [PostTypes], { nullable: true })
  postTypes: PostTypes[];

  @Field(() => DownloadStates, { defaultValue: DownloadStates.PENDING })
  status: DownloadStates;

  @Field(() => AssetType, { nullable: true })
  assetType: AssetType;
}
