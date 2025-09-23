import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { ImageType, MediaType, ProviderTokens } from '../../util/enums';
import { AwsS3Client, AwsS3RequestPreSignerClient } from './aws.module';

interface UploadImageInput {
  buffer: Buffer;
  metaData: Record<string, string>;
  originalFileName: string;
  mimeType: string;
  mediaType: MediaType;
  userId: string;
  imageType: ImageType;
}

const EXTENSION_REGEX = /_original\.[^/.]+$/;

@Injectable()
export class AwsS3ClientService {
  private logger = new Logger(AwsS3ClientService.name);
  private bucketName: string;

  public constructor(
    @Inject(ProviderTokens.AWS_S3_TOKEN) private awsS3Client: AwsS3Client,
    @Inject(ProviderTokens.AWS_S3_REQUEST_PRE_SIGNER_TOKEN)
    private awsS3RequestPreSignerClient: AwsS3RequestPreSignerClient,
    configService: ConfigService,
  ) {
    this.bucketName = configService.getOrThrow('AWS_BUCKET_NAME');
  }

  public async uploadR2Object(input: UploadImageInput): Promise<string> {
    const extendedUrl = this.createUrl(input.originalFileName, input.mediaType, input.userId);

    const { url, path } = this.getImagePathAndUrl({ url: extendedUrl, imageType: input.imageType });

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      ACL: 'public-read',
      Body: input.buffer,
      Metadata: input.metaData,
      ContentType: input.mimeType,
    });

    await this.awsS3Client.send(command);

    return url;
  }

  public async generateSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.awsS3RequestPreSignerClient, command, { expiresIn: 60 });
  }

  public generateDefaultFanAvatarUrl(username: string): string {
    return `https://avatar.iran.liara.run/username?username=${username}r&background=f4d9b2&color=FF9800`;
  }

  public generateDefaultCreatorAvatarUrl(username: string): string {
    return `https://avatar.iran.liara.run/username?username=${username}&background=f4d9b2&color=FF9800`;
  }

  public generateDefaultFanBannerUrl(): string {
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/4096/2160`;
  }

  public generateDefaultCreatorBannerUrl(): string {
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/4096/2160`;
  }

  public getImagePathAndUrl(input: { url: string; imageType: ImageType }): {
    url: string;
    path: string;
  } {
    const { url, imageType } = input;

    const uri = new URL(input.url);

    const imageTypeWithExtension = `_${imageType}.jpg`;

    if (!url) return { url: '', path: '' };

    if (imageType.includes('original')) return { url, path: uri.pathname.substring(1) };

    return {
      url: url.replace(EXTENSION_REGEX, imageTypeWithExtension),
      path: uri.pathname.replace(EXTENSION_REGEX, imageTypeWithExtension).substring(1),
    };
  }

  public createUrl(originalFileName: string, mediaType: MediaType, userId: string): string {
    const extension = path.extname(originalFileName).substring(1);

    const rawFileName = `${mediaType}/${userId}/${randomUUID()}/_original.${extension}`;

    return `${process.env.AWS_BUCKET_URL}/${rawFileName}`;
  }
}
