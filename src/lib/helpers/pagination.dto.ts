import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SortOrder } from '../../services/service.constants';

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
}
