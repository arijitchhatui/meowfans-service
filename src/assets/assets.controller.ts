import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  public constructor(private assetsService: AssetsService) {}

  @Post('/insert')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }))
  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  public async insertAsset(@CurrentUser() creatorId: string, @UploadedFile() file: Express.Multer.File) {
    return this.assetsService.insertAsset(creatorId, file);
  }
}
