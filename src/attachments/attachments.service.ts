import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachments.entity';
import { AttachmentIndexService } from 'src/libs/attachment-index.service';
import * as path from 'path';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepo: Repository<Attachment>,
    private readonly index: AttachmentIndexService,
  ) {}

  async registerAttachment(productId: string, meta: Partial<Attachment>) {
    const saved = await this.attachmentRepo.save({ ...meta, productId });

    const filePath = typeof meta.filePath === 'string' ? meta.filePath : '';
    const normalized = filePath.split(path.sep).join('/'); // normalize for Win/Linux
    const parts = normalized.split('/'); // e.g. ['images','screenshots','ui.png']

    this.index.ensureProductRoot(productId);
    this.index.updateTree(productId, parts.join('/'));

    return saved;
  }

  getTree(productId: string) {
    const tree = this.index.getTree(productId);
    return tree ? tree.toJSON() : {};
  }
}
