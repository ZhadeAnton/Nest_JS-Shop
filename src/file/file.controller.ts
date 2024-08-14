import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  @Auth()
  @Post()
  async saveFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query() folder?: string,
  ) {
    return this.fileService.saveFile(files, folder);
  }
}
