import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserCreateRequestDto } from './dto/request/user-create.request.dto';
import { UserListQueryRequestDto } from './dto/request/user-list-query.request.dto';
import { UserUpdateRequestDto } from './dto/request/user-update.request.dto';
import { UserDetailsResponseDto } from './dto/response/user-details.response.dto';
import { UserListResponseDto } from './dto/response/user-list.response.dto';
import { UserResponseMapper } from './user.response.mapper';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get list of users' })
  @Get()
  async getAllUsers(
    @Query() query: UserListQueryRequestDto,
  ): Promise<UserListResponseDto> {
    const result = await this.userService.getAllUsers(query);
    return UserResponseMapper.toListDto(result, query);
  }

  @ApiOperation({ summary: 'Create new user' })
  @Post()
  async createUser(
    @Body() body: UserCreateRequestDto,
  ): Promise<UserDetailsResponseDto> {
    const result = await this.userService.createUser(body);
    return UserResponseMapper.toDetailsDto(result);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @UseGuards(AuthGuard('bearer'))
  @Get(':userId')
  async getUserById(
    @Param('userId') userId: string,
  ): Promise<UserDetailsResponseDto> {
    const result = await this.userService.getUserById(userId);
    return UserResponseMapper.toDetailsDto(result);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() body: UserUpdateRequestDto,
  ): Promise<UserDetailsResponseDto> {
    const result = await this.userService.updateUser(userId, body);
    return UserResponseMapper.toDetailsDto(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id' })
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.deleteUser(userId);
  }
  //TODO deportation login to module auth
  @Post('login')
  @ApiOperation({ summary: 'login' })
  async loginUser(@Body() body: any) {
    return await this.userService.login(body);
  }
}
