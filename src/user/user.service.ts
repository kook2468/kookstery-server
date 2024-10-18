import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { mapError } from 'src/utils/error-mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;

    let errors: Record<string, string> = {};

    // 이메일과 유저이름이 이미 저장 사용되고 있는 것인지 확인
    const emailUser = await this.findByEmail(email);
    const usernameUser = await this.findByUsername(username);

    // 이미 있다면 errors 객체에 넣어줌
    if (emailUser) errors.email = '이미 해당 이메일 주소가 사용되었습니다.';
    if (usernameUser) errors.username = '이미 이 사용자 이름이 사용되었습니다.';

    // 에러가 있다면 에러를 response 해줌
    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({ errors });
    }

    // User 엔티티 생성 시 해싱 호출
    const user = this.userRepository.create(createUserDto);

    // dto에 정해놓은 조건으로 user 데이터의 유효성 검사를 해줌.
    const validationErrors = await validate(user);
    if (validationErrors.length > 0) {
      throw new BadRequestException({ errors: mapError(validationErrors) });
    }

    try {
      // save 메서드를 호출할 때 @BeforeInsert에 설정된 hashPassword가 호출됨
      const savedUser = await this.userRepository.save(user); // 유저정보를 user 테이블에 저장

      console.log('savedUser', savedUser);
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        '사용자 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
