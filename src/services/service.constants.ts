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

export enum PostTypes {
  PUBLIC = 'PUBLIC',
  EXCLUSIVE = 'EXCLUSIVE',
  PRIVATE = 'PRIVATE',
  ARCHIVED = 'ARCHIVED',
  HIDDEN = 'HIDDEN',
  BANNED = 'BANNED',
}

export enum FileType {
  VIDEO = 'video',
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

export enum MediaType {
  PROFILE_MEDIA = 'profileMedia',
  MESSAGE_MEDIA = 'messageMedia',
  POST_MEDIA = 'postMedia',
}

export enum ImageType {
  BLURRED = 'blurred',
  ORIGINAL = 'original',
  RESIZED = 'resized',
}

export enum ProviderTokens {
  TYPE_SENSE_TOKEN = 'TYPE_SENSE_TOKEN',
}

export const DEFAULT_POST_PRICE = 500;
