import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    console.log('@@bootstrap() ==> Initializing new server instance');
    try {
      const app = await NestFactory.create(AppModule);
      app.enableCors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      });

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

      await app.init();
      cachedServer = app;
    } catch (error) {
      console.error('Bootstrap error:', error);
      throw error;
    }
  }
  return cachedServer;
}

// 개발 환경에서만 실행
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running on port:', process.env.PORT || 3000);
    });
  });
}

// Vercel 서버리스 함수
export const handler = async (req: any, res: any) => {
  try {
    const app = await bootstrap();
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error) {
    console.error('Request handling error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};

export default handler;
