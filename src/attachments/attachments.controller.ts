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
      properties: { file: { type: 'string', format: 'binary' } },
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
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Attachment> {
    const ext = path.extname(file.originalname).replace('.', '');
    const meta: AttachmentMetadata = {
      fileName: file.originalname,
      filePath: file.path,
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
