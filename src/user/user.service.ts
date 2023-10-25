import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users = [];

  create(createUserDto: CreateUserDto) {
    this.users.push(createUserDto);
    return 'This action adds a new user';
  }

  findAll(): CreateUserDto[] {
    return this.users;
  }

  findOne(userId: string) {
    console.log(userId);
    return this.users.find((item) => item.userId === +userId);
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const index = this.users.indexOf(
        await this.users.find((item) => item.userId === userId),
      );
      if (!index) throw new Error('no index');
      this.users.splice(index, 1, updateUserDto);
      return await this.users[userId];
    } catch (e) {
      console.error(e.message);
    }
  }

  async remove(userId: number) {
    try {
      const index = this.users.indexOf(
        await this.users.find((item) => item.userId === userId),
      );
      if (!index) throw new Error('no user');
      this.users.splice(index, 1, '');
      return await this.users[userId];
    } catch (e) {
      console.error(e.message);
    }
  }
}
