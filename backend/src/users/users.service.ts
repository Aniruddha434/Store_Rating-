import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Password should already be hashed by the caller (AuthService or Admin)
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(filters?: any) {
    const query = this.usersRepository.createQueryBuilder('user');
    if (filters?.name) query.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters?.email) query.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    if (filters?.address) query.andWhere('user.address ILIKE :address', { address: `%${filters.address}%` });
    if (filters?.role) query.andWhere('user.role = :role', { role: filters.role });
    if (filters?.sortBy) query.orderBy(`user.${filters.sortBy}`, filters.sortOrder || 'ASC');
    return query.getMany();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });
    return { message: 'Password updated successfully' };
  }

  async getStats() {
    const totalUsers = await this.usersRepository.count();
    return { totalUsers };
  }
}
