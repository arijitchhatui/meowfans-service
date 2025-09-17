import { ProviderTokens } from '@app/enums';
import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3ClientService } from './aws.service';

export type AwsS3Client = AWS.S3;

@Module({
  providers: [
    {
      provide: ProviderTokens.AWS_S3_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): AwsS3Client => {
        return new AWS.S3({
          region: 'auto',
          endpoint: configService.getOrThrow('AWS_S3_ENDPOINT'),
          credentials: {
            secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
            accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
          },
        });
      },
    },
    AwsS3ClientService,
  ],
  exports: [AwsS3ClientService],
})
export class AwsS3Module {}
