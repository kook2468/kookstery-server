import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

let app: any;

async function bootstrap() {
  if (!app) {
    console.log('@@bootstrap() ==> Initializing new server instance');
    app = await NestFactory.create(AppModule);
    app.enableCors();

    app.use((req, res, next) => {
      req.headers['content-type'] = 'application/json';
      next();
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => new BadRequestException(errors),
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    const options = new DocumentBuilder()
      .setTitle('Kookstery API Docs')
      .setDescription('Kookstery 신비한 상점 API description')
      .setVersion('1.0')
      .addServer(process.env.APP_URL, 'Local environment')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }
  return app;
}

// 로컬 개발 환경을 위한 서버 시작
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running on port:', process.env.PORT || 3000);
    });
  });
}

// Vercel 서버리스 함수
export const handler = async (req: any, res: any) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
};

// 기본 export를 handler로 설정
export default handler;
