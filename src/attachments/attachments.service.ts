import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachments.entity';
import { AttachmentIndexService } from 'src/libs/attachment-index.service';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepo: Repository<Attachment>,
    private readonly index: AttachmentIndexService,
  ) {}

  async registerAttachment(productId: string, meta: Partial<Attachment>) {
    const saved = await this.attachmentRepo.save({ ...meta, productId });

    this.index.updateTree(productId, meta.filePath!);

    return saved;
  }

  getTree(productId: string) {
    const tree = this.index.getTree(productId);
    return tree ? tree.toJSON() : {};
  }
}
