import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  create(createStoreDto: CreateStoreDto) {
    const store = this.storesRepository.create(createStoreDto);
    return this.storesRepository.save(store);
  }

  async findAll(filters?: any) {
    const query = this.storesRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating')
      .select([
        'store.id',
        'store.name',
        'store.email',
        'store.address',
        'AVG(rating.rating) as avgRating',
      ])
      .groupBy('store.id');

    if (filters?.name) query.andWhere('store.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters?.address) query.andWhere('store.address ILIKE :address', { address: `%${filters.address}%` });
    if (filters?.sortBy) query.orderBy(`store.${filters.sortBy}`, filters.sortOrder || 'ASC');

    return query.getRawMany();
  }

  async getStats() {
    const totalStores = await this.storesRepository.count();
    return { totalStores };
  }

  findOne(id: number) {
    return this.storesRepository.findOne({ where: { id }, relations: ['ratings'] });
  }
}
