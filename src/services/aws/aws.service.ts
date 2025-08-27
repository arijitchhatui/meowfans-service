import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { ImageType, MediaType, ProviderTokens } from '../service.constants';
import { AwsS3Client } from './aws.module';

interface UploadImageInput {
  buffer: Buffer;
  metaData: Record<string, string>;
  file: Express.Multer.File;
  mediaType: MediaType;
  userId: string;
  imageType: ImageType;
}

const EXTENSION_REGEX = /_original\.[^/.]+$/;

@Injectable()
export class AwsS3ClientService {
  private bucketName: string;

  public constructor(
    @Inject(ProviderTokens.AWS_S3_TOKEN) private awsS3Client: AwsS3Client,
    configService: ConfigService,
  ) {
    this.bucketName = configService.getOrThrow('AWS_BUCKET_NAME');
  }

  public async uploadImage(input: UploadImageInput): Promise<string> {
    const extendedUrl = this.createUrl(input.file, input.mediaType, input.userId);

    const { url, path } = this.getImagePathAndUrl({ url: extendedUrl, imageType: input.imageType });

    await this.awsS3Client.putObject({
      Bucket: this.bucketName,
      Key: path,
      ACL: 'public-read',
      Body: input.buffer,
      Metadata: input.metaData,
      ContentType: input.file.mimetype,
    });

    return url;
  }

  public generateDefaultFanAvatarUrl(username: string): string {
    return `https://avatar.iran.liara.run/username?username=${username}r&background=f4d9b2&color=FF9800`;
  }

  public generateDefaultCreatorAvatarUrl(username: string): string {
    return `https://avatar.iran.liara.run/username?username=${username}&background=f4d9b2&color=FF9800`;
  }

  public generateDefaultFanBannerUrl(): string {
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/4096/2160`;
  }

  public generateDefaultCreatorBannerUrl(): string {
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/4096/2160`;
  }

  public getImagePathAndUrl(input: { url: string; imageType: ImageType }): {
    url: string;
    path: string;
  } {
    const { url, imageType } = input;

    const uri = new URL(input.url);

    const imageTypeWithExtension = `_${imageType}.jpg`;

    if (!url) return { url: '', path: '' };

    if (imageType.includes('original')) return { url, path: uri.pathname };

    return {
      url: url.replace(EXTENSION_REGEX, imageTypeWithExtension),
      path: uri.pathname.replace(EXTENSION_REGEX, imageTypeWithExtension),
    };
  }

  public createUrl(file: Express.Multer.File, mediaType: MediaType, userId: string): string {
    const extension = path.extname(file.originalname).substring(1);
    console.log(file.originalname);

    const rawFileName = `${mediaType}/${userId}/${randomUUID()}/_original.${extension}`;

    return `${process.env.AWS_BUCKET_URL}/${rawFileName}`;
  }
}
