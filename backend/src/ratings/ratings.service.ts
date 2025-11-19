import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async create(userId: number, createRatingDto: CreateRatingDto) {
    const existing = await this.ratingsRepository.findOne({
      where: { userId, storeId: createRatingDto.storeId },
    });

    if (existing) {
      existing.rating = createRatingDto.rating;
      return this.ratingsRepository.save(existing);
    }

    const rating = this.ratingsRepository.create({
      userId,
      ...createRatingDto,
    });
    return this.ratingsRepository.save(rating);
  }

  findByUser(userId: number) {
    return this.ratingsRepository.find({
      where: { userId },
      relations: ['store'],
    });
  }

  findByStore(storeId: number) {
    return this.ratingsRepository.find({
      where: { storeId },
      relations: ['user'],
    });
  }

  async getStats() {
    const totalRatings = await this.ratingsRepository.count();
    return { totalRatings };
  }

  async getAverageForStore(storeId: number) {
    const result = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .where('rating.storeId = :storeId', { storeId })
      .getRawOne();
    return { average: parseFloat(result.average) || 0 };
  }
}
