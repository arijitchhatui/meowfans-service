import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { DEFAULT_AVATAR_URL, DEFAULT_BANNER_URL } from '../../util/constants';
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
    @Inject(ProviderTokens.DO_S3_TOKEN) private awsS3Client: AwsS3Client,
    @Inject(ProviderTokens.AWS_S3_REQUEST_PRE_SIGNER_TOKEN)
    private awsS3RequestPreSignerClient: AwsS3RequestPreSignerClient,
    configService: ConfigService,
  ) {
    this.bucketName = configService.getOrThrow('DO_BUCKET_NAME');
  }

  public async uploadR2Object(input: UploadImageInput): Promise<string> {
    const extendedUrl = this.createUrl(input.mediaType, input.userId);

    const { url, path } = this.getImagePathAndUrl({ url: extendedUrl, imageType: input.imageType });

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      ACL: 'public-read',
      Body: input.buffer,
      Metadata: input.metaData,
      ContentType: 'image/webp',
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

  public generateDefaultFanAvatarUrl(): string {
    return DEFAULT_AVATAR_URL;
  }

  public generateDefaultCreatorAvatarUrl(): string {
    return DEFAULT_AVATAR_URL;
  }

  public generateDefaultFanBannerUrl(): string {
    return DEFAULT_BANNER_URL;
  }

  public generateDefaultCreatorBannerUrl(): string {
    return DEFAULT_BANNER_URL;
  }

  public getImagePathAndUrl(input: { url: string; imageType: ImageType }): {
    url: string;
    path: string;
  } {
    const { url, imageType } = input;

    const uri = new URL(input.url);

    const imageTypeWithExtension = `_${imageType}.webp`;

    if (!url) return { url: '', path: '' };

    if (imageType.includes('original')) return { url, path: uri.pathname.substring(1) };

    return {
      url: url.replace(EXTENSION_REGEX, imageTypeWithExtension),
      path: uri.pathname.replace(EXTENSION_REGEX, imageTypeWithExtension).substring(1),
    };
  }

  public createUrl(mediaType: MediaType, userId: string): string {
    const rawFileName = `${mediaType}/${userId}/${randomUUID()}/_original.webp`;

    return `${process.env.DO_BUCKET_URL}/${rawFileName}`;
  }
}
