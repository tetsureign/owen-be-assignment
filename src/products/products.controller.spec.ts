/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id: 'uuid-123',
    name: 'Smart Katana',
    price: 1200,
    description: 'Nano-edge chrome blade',
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockProduct),
            findAll: jest.fn().mockResolvedValue([mockProduct]),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            update: jest
              .fn()
              .mockResolvedValue({ ...mockProduct, name: 'Updated' }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'Smart Katana', price: 1200 };
    const result = await controller.create(dto);
    expect(result).toEqual(mockProduct);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return one product', async () => {
    const result = await controller.findOne(mockProduct.id);
    expect(result).toEqual(mockProduct);
  });

  it('should update a product', async () => {
    const result = await controller.update(mockProduct.id, {
      name: 'Updated',
    } as any);
    expect(result.name).toBe('Updated');
  });

  it('should remove a product', async () => {
    const result = await controller.remove(mockProduct.id);
    expect(result).toBeUndefined();
  });

  it('should return paginated product list with meta', async () => {
    const mockResponse = {
      data: [mockProduct],
      total: 1,
      page: 1,
      limit: 10,
      pages: 1,
    };

    (service.findAll as jest.Mock).mockResolvedValueOnce(mockResponse);

    const query = {
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'DESC',
    } as any;
    const result = await controller.findAll(query);

    expect(result).toEqual(mockResponse);
    expect(service.findAll).toHaveBeenCalledWith(1, 10, 'createdAt', 'DESC');
  });
});
