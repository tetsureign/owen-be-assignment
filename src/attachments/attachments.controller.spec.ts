/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './entities/attachments.entity';

describe('AttachmentsController', () => {
  let controller: AttachmentsController;
  let service: jest.Mocked<AttachmentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentsController],
      providers: [
        {
          provide: AttachmentsService,
          useValue: {
            registerAttachment: jest.fn().mockResolvedValue({
              id: 4,
              productId: 'abc',
              fileName: 'ui.png',
            } as Partial<Attachment>),
            getTree: jest.fn().mockReturnValue({
              images: { screenshots: { 'ui.png': {} } },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get(AttachmentsController);
    service = module.get(AttachmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call registerAttachment with productId and metadata', async () => {
    const file = {
      originalname: 'ui.png',
      path: 'uploads/abc/images/screenshots/ui.png',
      size: 555,
    } as any;

    const res = await controller.upload('abc', file);
    expect(service.registerAttachment).toHaveBeenCalledWith(
      'abc',
      expect.any(Object),
    );
    expect(res.fileName).toBe('ui.png');
  });

  it('should return tree structure JSON', () => {
    const tree = controller.getTree('abc');
    expect(tree.images.screenshots).toEqual({ 'ui.png': {} });
    expect(service.getTree).toHaveBeenCalledWith('abc');
  });
});
