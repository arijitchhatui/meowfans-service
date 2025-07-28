export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  EMAIL_LOGIN = 'email_login',
}

export const AuthGuardStrategyMapping = {
  JWT: 'jwt',
  LOCAL: 'local',
  OPTIONAL_JWT_AUTH: 'optional-jwt-auth',
  ADMIN_JWT_AUTH: 'admin-jwt_auth',
} as const;

export const USER_NAME_CASE_REGEX = /\[^a-z0-9]/g; // Hello World! 123 ===>>>> hello world 123
export const REMOVE_SPACE_REGEX = /\s+/g;

export const JWT_VERSION = 'v1';
export const SALT = 10;
