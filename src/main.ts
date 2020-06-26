import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { HttpExceptionFilter } from './common/error/filters/http-exception.filter';
import { ApiParamsValidationPipe } from './common/error/pipe/api-params-validation.pipe';
import { config } from './config/config.json';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(session({
    secret :  'secret',
    resave : true,
    saveUninitialized: true,
    cookie : {
      maxAge : 1000 * 60 * 3,
    },
  }));
  // 允许跨域
  app.enableCors();
  app.useStaticAssets(join(__dirname, '.', 'public'), { prefix: '/public/' });
  app.setBaseViewsDir(join(__dirname, '.', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ApiParamsValidationPipe());
  app.setGlobalPrefix(config.globalPrefix);
  await app.listen(config.port);
}
bootstrap();
