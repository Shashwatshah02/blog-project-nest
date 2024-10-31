import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import * as expressLayouts from 'express-ejs-layouts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setViewEngine('ejs');
  // app.use(express.static('public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use('/public', express.static(join(__dirname, '..', 'public')));
  // app.use(expressLayouts);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
