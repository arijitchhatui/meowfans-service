export enum TokenType {
  ACCESS_TOKEN = 'access_token',
}

export const AuthGuardStrategyMapping = {
  JWT: 'jwt',
  LOCAL: 'local',
  OPTIONAL_JWT_AUTH: 'optional-jwt-auth',
  ADMIN_JWT_AUTH: 'admin-jwt_auth',
} as const;
