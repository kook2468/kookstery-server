import { Request, Response } from 'express';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: ResponseDto<User>,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input, validation failed',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<{ user: User }>> {
    const user = await this.userService.createUser(createUserDto);
    return new ResponseDto(true, { user });
  }

  @ApiOperation({ summary: '유저리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 유저 리스트 불러오기',
    type: [User],
    example: [
      {
        id: 1,
        createdDate: '2024-10-10T06:48:04.649Z',
        updatedDate: '2024-10-10T06:48:04.649Z',
        email: 'username@gmail.com',
        username: 'username',
        password: 'password',
      },
    ],
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
