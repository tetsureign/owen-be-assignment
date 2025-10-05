import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachments.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepo: Repository<Attachment>,
  ) {}

  async registerAttachment(productId: number, meta: Partial<Attachment>) {
    const entity = this.attachmentRepo.create({ ...meta, productId });
    return this.attachmentRepo.save(entity);
  }

  async getTree(productId: number) {
    const attachments = await this.attachmentRepo.findBy({ productId });
    // Build tree structure from file paths
  }
}
