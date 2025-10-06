/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from './attachments.service';
import { AttachmentIndexService } from 'src/libs/attachment-index.service';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachments.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let repo: jest.Mocked<Repository<Attachment>>;
  let index: jest.Mocked<AttachmentIndexService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: { save: jest.fn() },
        },
        {
          provide: AttachmentIndexService,
          useValue: {
            ensureProductRoot: jest.fn(),
            updateTree: jest.fn(),
            getTree: jest.fn().mockReturnValue({
              toJSON: jest.fn().mockReturnValue({
                images: { screenshots: { 'ui.png': {} } },
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get(AttachmentsService);
    repo = module.get(getRepositoryToken(Attachment));
    index = module.get(AttachmentIndexService);
  });

  it('should save and index file path', async () => {
    repo.save.mockResolvedValue({
      id: 42,
      filePath: 'images/screenshots/ui.png',
      productId: 'abc',
    } as any);

    const meta = { filePath: 'images/screenshots/ui.png', size: 1234 };
    const result = await service.registerAttachment('abc', meta);

    expect(repo.save).toHaveBeenCalledWith({ ...meta, productId: 'abc' });
    expect(index.updateTree).toHaveBeenCalledWith(
      'abc',
      'images/screenshots/ui.png',
    );
    expect(result.id).toEqual(42);
  });

  it('should get tree JSON', () => {
    const result = service.getTree('abc');
    expect(result).toHaveProperty('images');
    expect(index.getTree).toHaveBeenCalledWith('abc');
  });
});
