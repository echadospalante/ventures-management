import * as Joi from 'joi';

export interface EnvironmentSetup {
  PORT: number;
  APP_NAME: string;
  METRICS_PORT: string;
  PROJECT_ID: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SYNC: boolean;
  DB_LOGGING: boolean;
  RABBIT_URI: string;
}

const {
  PORT,
  APP_NAME,
  METRICS_PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_SYNC,
  DB_LOGGING,
  RABBIT_URI,
} = process.env;

export const environment = () => ({
  PORT,
  APP_NAME,
  METRICS_PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_SYNC,
  DB_LOGGING,
  RABBIT_URI,
});

export const JoiValidationSchema = Joi.object<EnvironmentSetup>({
  // --------------------------------------------------------------
  PORT: Joi.number().required().min(1).max(65535),
  APP_NAME: Joi.string().required(),
  METRICS_PORT: Joi.number().required().min(1).max(65535),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required().min(1).max(65535),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().truthy('true').falsy('false').sensitive().required(),
  DB_LOGGING: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .sensitive()
    .required(),
  RABBIT_URI: Joi.string().required(),
});
