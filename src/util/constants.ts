export const env = {
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

type envKeys = keyof typeof env;
export const getEnv = (key: envKeys) => env[key];
