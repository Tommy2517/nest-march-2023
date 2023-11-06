import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserEntity } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private users = [];

  constructor(private readonly userRepository: UserRepository) {}

  async create(userData: CreateUserDto) {
    const userEmail = userData.email.trim();
    const findUser = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (findUser) {
      throw new Error();
    }
    try {
      const newUser = this.userRepository.create(userData);
      if (!userData.city) newUser.city = 'Odessa';
      return await this.userRepository.save(newUser);
    } catch (err) {
      throw new HttpException('User is already exist', HttpStatus.BAD_REQUEST);
    }
  }

  findAll(): CreateUserDto[] {
    return this.users;
  }

  findOne(userId: string) {
    console.log(userId);
    return this.users.find((item) => item.id === +userId);
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const index = this.users.indexOf(
        await this.users.find((item) => item.id === userId),
      );
      if (!index) throw new Error('no index');
      this.users.splice(index, 1, updateUserDto);
      return await this.users[userId];
    } catch (e) {
      console.error(e.message);
    }
  }

  async remove(userId: number): Promise<UserEntity> {
    try {
      const index = this.users.indexOf(
        await this.users.find((item) => item.userId === userId),
      );
      if (!index) throw new Error('no user');
      this.users.splice(index, 1, '');
      return this.users[userId];
    } catch (e) {
      console.error(e.message);
    }
  }
}
