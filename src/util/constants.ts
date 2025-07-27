import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { REMOVE_SPACE_REGEX } from '../auth';

export const AVATAR_COLORS = [
  '#5865f2',
  '#57f287',
  '#ed4245',
  '#eb459e',
  '#0080ff',
  '#df9666',
  '#82c782',
  '#effd5f',
  '#ff9c00',
  '#f05e23',
  '#cb5aff',
];
export const BANNER_COLORS = [
  '#5865f2',
  '#57f287',
  '#ed4245',
  '#eb459e',
  '#0080ff',
  '#df9666',
  '#82c782',
  '#ff9c00',
  '#f05e23',
  '#cb5aff',
];

export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const nameParts = fullName.trim().split(REMOVE_SPACE_REGEX);
  const hasLastName = nameParts.length > 1;

  const firstName = hasLastName ? nameParts.slice(0, -1).join(' ') : fullName.trim();
  const lastName = (hasLastName ? nameParts[nameParts.length - 1] : null) || '';

  return { firstName, lastName };
};

export enum UserRoles {
  FAN = 'fan',
  ADMIN = 'admin',
  SUPER_VIEWER = 'super_viewer',
  CREATOR = 'creator',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class PaginationInput {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { defaultValue: 0 })
  offset: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { defaultValue: 30 })
  limit: number;

  @IsEnum(SortOrder)
  @Field(() => String, { defaultValue: SortOrder.DESC })
  orderBy: SortOrder;

  @Field(() => [ID])
  relatedEntityId: string;
}
