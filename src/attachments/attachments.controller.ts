import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './entities/attachments.entity';

type AttachmentMetadata = {
  fileName: string;
  filePath: string;
  extension: string;
  size: number;
};

@Controller('products/:productId/attachments')
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = `uploads/${req.params.productId}`;
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async upload(
    @Param('productId') productId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Attachment> {
    const ext = path.extname(file.originalname).replace('.', '');
    const meta: AttachmentMetadata = {
      fileName: file.originalname,
      filePath: file.path,
      extension: ext,
      size: file.size,
    };

    return this.service.registerAttachment(Number(productId), meta);
  }

  @Get('tree')
  async getTree(@Param('productId') productId: number) {
    return this.service.getTree(Number(productId));
  }
}
