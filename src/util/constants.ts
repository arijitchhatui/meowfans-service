import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { REMOVE_SPACE_REGEX } from '../auth';

export const envs = {
  PORT: process.env.PORT || '',
  ENABLE_DEV_TOOLS: process.env.ENABLE_DEV_TOOLS || '',
  NODE_ENV: process.env.NODE_ENV || '',
  POSTGRES_HOST: process.env.POSTGRES_HOST || '',
  POSTGRES_TYPE: process.env.POSTGRES_TYPE || '',
  POSTGRES_UUID_EXTENSION: process.env.POSTGRES_UUID_EXTENSION || '',
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME || '',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
  POSTGRES_DB: process.env.POSTGRES_DB || '',
  POSTGRES_PORT: process.env.POSTGRES_PORT || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
};

type envKeys = keyof typeof envs;
export const getConfigService = (key: envKeys) => envs[key];

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
