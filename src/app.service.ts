import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<title>DG Market 서버</title>
    <h2>DG Market 서버</h2>
    DG Market 서버입니다 😃
    
    자세한 API 호출 안내는 <a href="/api">/api</a>로 접속해주세요!`;
  }
}
