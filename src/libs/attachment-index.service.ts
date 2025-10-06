import { Injectable, OnModuleInit } from '@nestjs/common';
import { HashMap } from './hashmap';
import { AttachmentNode } from './attachment-tree';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from 'src/attachments/entities/attachments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttachmentIndexService implements OnModuleInit {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: Repository<Attachment>,
  ) {}

  private readonly index = new HashMap<string, AttachmentNode>();

  async onModuleInit() {
    const attachments = await this.repo.find();
    const productIds = [...new Set(attachments.map((a) => a.productId))];
    this.rebuildFromDB(productIds, attachments);
    console.log(
      `[AttachmentIndex] Built index for ${productIds.length} products.`,
    );
  }

  getTree(productId: string): AttachmentNode | undefined {
    return this.index.get(productId);
  }

  setTree(productId: string, node: AttachmentNode): void {
    this.index.set(productId, node);
  }

  updateTree(productId: string, filePath: string): void {
    const root = this.index.get(productId);
    if (!root) return;
    root.insert(filePath.split('/'));
  }

  rebuildFromDB(productIds: string[], allAttachments: Attachment[]): void {
    // Rebuild index by iterating all attachments from DB
    for (const pid of productIds) {
      const root = new AttachmentNode('root', 'folder');
      const attForProduct = allAttachments.filter((a) => a.productId === pid);
      for (const att of attForProduct) {
        root.insert(att.filePath.split('/'));
      }
      this.index.set(pid, root);
    }
  }

  ensureProductRoot(productId: string): void {
    if (!this.index.get(productId)) {
      this.index.set(productId, new AttachmentNode('root', 'folder'));
    }
  }
}
