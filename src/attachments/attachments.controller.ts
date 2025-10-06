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
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';

type AttachmentMetadata = {
  fileName: string;
  filePath: string;
  extension: string;
  size: number;
};

@ApiTags('Attachments')
@Controller('products/:productId/attachments')
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}

  @Post('upload')
  @ApiParam({ name: 'productId', description: 'UUID of the product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folderPath: { type: 'string', example: 'images/screenshots' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Upload attachment for the product.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const productRoot = path.join('uploads', req.params.productId);

          const rawFolderPath =
            (req.body as UploadAttachmentDto).folderPath ?? '';
          const folderPath = path.normalize(rawFolderPath);
          const dest = path.join(productRoot, folderPath);

          fs.promises
            .mkdir(dest, { recursive: true })
            .then(() => cb(null, dest))
            .catch((err: Error) => cb(err, dest));
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async upload(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Attachment> {
    const ext = path.extname(file.originalname).replace('.', '');

    const relativePath = path.relative(
      path.join('uploads', productId),
      file.path,
    );

    const meta: AttachmentMetadata = {
      fileName: file.originalname,
      filePath: relativePath,
      extension: ext,
      size: file.size,
    };

    return this.service.registerAttachment(productId, meta);
  }

  @Get('tree')
  @ApiResponse({
    status: 200,
    description: 'Returns folder/file hierarchy as JSON.',
  })
  getTree(@Param('productId') productId: string) {
    return this.service.getTree(productId);
  }
}
