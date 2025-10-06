import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachments.entity';
import { AttachmentIndexService } from 'src/libs/attachment-index.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, AttachmentIndexService],
  exports: [AttachmentsService, AttachmentIndexService],
})
export class AttachmentsModule {}
