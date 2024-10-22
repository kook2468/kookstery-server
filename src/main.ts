import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config(); //앱모듈 생성 전 env파일 쓰기 위해 설정

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  // Global validation pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드 제거
      forbidNonWhitelisted: true, // 허용되지 않은 필드가 있으면 오류 발생
      transform: true, // 요청 데이터를 DTO로 변환
      exceptionFactory: (errors) => new BadRequestException(errors), //유효성 검사 오류가 발생했을때 BadRequestException 에러 발생하도록 처리
    }),
  );

  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('Kook Studio API Docs')
    .setDescription('Kook Studio의 신비한 상점 API description')
    .setVersion('1.0')
    .addServer(process.env.APP_URL, 'Local environment')
    //.addServer('https://staging.yourapi.com/', 'Staging')
    //.addServer('https://production.yourapi.com/', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
