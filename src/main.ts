import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    console.log('@@bootstrap() ==> Initializing new server instance');
    try {
      const app = await NestFactory.create(AppModule);
      app.enableCors(); // CORS 활성화
      app.enableShutdownHooks(); //종료 시 필요한 클린업 작업을 자동으로 처리

      app.use((req, res, next) => {
        req.headers['content-type'] = 'application/json';
        next();
      });

      // Global validation pipe 설정
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true, // DTO에 없는 필드 제거
          forbidNonWhitelisted: true, // 허용되지 않은 필드가 있으면 오류 발생
          transform: true, // 요청 데이터를 DTO로 변환
          exceptionFactory: (errors) => new BadRequestException(errors), //유효성 검사 오류가 발생했을때 BadRequestException 에러 발생하도록 처리
        }),
      );

      app.useGlobalFilters(new HttpExceptionFilter());

      const options = new DocumentBuilder()
        .setTitle('Kookstery API Docs')
        .setDescription('Kookstery 신비한 상점 API description')
        .setVersion('1.0')
        .addServer(process.env.APP_URL, 'Local environment')
        //.addServer('https://staging.yourapi.com/', 'Staging')
        //.addServer('https://production.yourapi.com/', 'Production')
        .build();

      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('api', app, document);

      cachedApp = app;
    } catch (error) {
      console.error('@@error', error.message);
      throw error;
    }
  }
  return cachedApp;
}

export default bootstrap;
