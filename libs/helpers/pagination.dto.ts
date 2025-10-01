import { Field, ID, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AssetType, PostTypes, SortOrder, UserRoles } from '../../src/util/enums';
import { DownloadStates } from '../../src/util/enums/download-state';

registerEnumType(SortOrder, { name: 'SortOrder' });
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
  @Field(() => SortOrder, { defaultValue: SortOrder.DESC, nullable: true })
  orderBy: SortOrder;

  @Field(() => ID, { nullable: true })
  relatedEntityId?: string;

  @Field(() => ID, { nullable: true })
  relatedUserId?: string;

  @Field(() => [PostTypes], { nullable: true })
  postTypes: PostTypes[];

  @Field(() => DownloadStates, { defaultValue: DownloadStates.PENDING })
  status: DownloadStates;

  @Field(() => AssetType, { nullable: true, defaultValue: AssetType.PRIVATE })
  assetType: AssetType;

  @Field(() => UserRoles, { nullable: true, defaultValue: UserRoles.CREATOR })
  role: UserRoles;

  @Field(() => Int, { defaultValue: 1 })
  pageNumber: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip: number;

  @Field(() => Int, { defaultValue: 30, nullable: true })
  take: number;
}
