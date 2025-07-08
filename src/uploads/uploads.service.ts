import * as AWS from '@aws-sdk/client-s3';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface UploadImageInput {
  path: string;
  contentType: string;
  buffer: Buffer;
  metaData: Record<string, string>;
}

@Global()
@Injectable()
export class UploadsService {
  private readonly s3: AWS.S3;
  private bucketName: string;
  private bucketUrl: string;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: 'auto',
      endpoint: configService.getOrThrow('AWS_S3_ENDPOINT'),
      credentials: {
        secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      },
    });
    this.bucketUrl = configService.getOrThrow('AWS_BUCKET_URL');
    this.bucketName = configService.getOrThrow('AWS_BUCKET_NAME');
  }

  public async uploadImage(input: UploadImageInput) {
    await this.s3.putObject({
      Bucket: this.bucketName,
      Key: input.path,
      ACL: 'public-read',
      Body: input.buffer,
      Metadata: input.metaData,
      ContentType: input.contentType,
    });

    return `${this.bucketUrl}/${input.path}`;
  }

  public generateDefaultFanAvatarUrl(username: string) {
    return `https://avatar.iran.liara.run/username?username=${username}r&background=f4d9b2&color=FF9800`;
  }

  public generateDefaultCreatorAvatarUrl(username: string) {
    return `https://avatar.iran.liara.run/username?username=${username}&background=f4d9b2&color=FF9800`;
  }

  public generateDefaultFanBannerUrl() {
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/4096/2160`;
  }

  public generateDefaultCreatorBannerUrl() {
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/4096/2160`;
  }
}
