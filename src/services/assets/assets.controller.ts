import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UserRoles } from 'libs/enums/user-roles';
import { Auth, CurrentUser, GqlAuthGuard, JwtAuthGuard } from '../auth';
import { AssetsService } from './assets.service';
import { UploadMediaOutput } from './dto';
import { UploadMediaInput } from './dto/upload-media.input.dto';

@Controller('assets')
export class AssetsController {
  public constructor(private assetsService: AssetsService) {}

  @Auth(JwtAuthGuard, [UserRoles.CREATOR])
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
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
  public async uploadFile(
    @CurrentUser() creatorId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadMediaInput,
  ): Promise<UploadMediaOutput> {
    return this.assetsService.uploadFile(creatorId, file, body.mediaType);
  }
}
