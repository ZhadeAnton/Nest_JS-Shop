import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FileService {
  async saveFile(files: Express.Multer.File[], folder: string = 'products') {
    const uploadedFolder = `${path}/quploads/${folder}`;

    await ensureDir(uploadedFolder);

    const response = Promise.all(
      files.map(async (file) => {
        const originalName = `${Date.now()}-${file.originalname}`;
        
        await writeFile(`${uploadedFolder}/${originalName}`, file.buffer);

        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName,
        };
      }),
    );

    return response;
  }
}
