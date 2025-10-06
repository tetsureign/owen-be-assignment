/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: jest.Mocked<Repository<Product>>;

  const mockProduct: Product = {
    id: 'uuid-123',
    name: 'Smart Katana',
    price: 1200,
    description: 'Chrome edge',
    isActive: true,
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn().mockReturnValue(mockProduct),
            save: jest.fn().mockResolvedValue(mockProduct),
            find: jest.fn().mockResolvedValue([mockProduct]),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get(getRepositoryToken(Product));
  });

  it('should create a product', async () => {
    const dto = { name: 'Smart Katana', price: 1200 };
    const result = await service.create(dto as any);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(mockProduct);
    expect(result).toEqual(mockProduct);
  });

  it('should paginate results', async () => {
    const list = [mockProduct, { ...mockProduct, id: 'uuid-2' }];
    (repo.findAndCount as any) = jest.fn().mockResolvedValueOnce([list, 2]);
    const result = await service.findAll(1, 2);
    expect(result.data.length).toBe(2);
    expect(result.total).toBe(2);
  });

  it('should find one by id', async () => {
    repo.findOneBy.mockResolvedValueOnce(mockProduct);
    const result = await service.findOne(mockProduct.id);
    expect(result).toEqual(mockProduct);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: mockProduct.id });
  });

  it('should throw NotFound when id not found', async () => {
    repo.findOneBy.mockResolvedValueOnce(null);
    await expect(service.findOne('not-exist')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update an existing product', async () => {
    repo.findOneBy.mockResolvedValueOnce({ ...mockProduct });
    repo.save.mockResolvedValueOnce({ ...mockProduct, name: 'Updated' });
    const result = await service.update(mockProduct.id, {
      name: 'Updated',
    } as any);
    expect(result.name).toBe('Updated');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should remove a product', async () => {
    repo.delete.mockResolvedValueOnce({ affected: 1 } as DeleteResult);
    await service.remove(mockProduct.id);
    expect(repo.delete).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should throw NotFound on delete if nothing affected', async () => {
    repo.delete.mockResolvedValueOnce({ affected: 0 } as DeleteResult);
    await expect(service.remove('ghost')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
