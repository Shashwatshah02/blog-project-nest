import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as expressLayouts from 'express-ejs-layouts';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Middleware setup
  app.use(express.static('public'));
  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.use(expressLayouts);

  // Configure session before passport
  app.use(
    session({
      secret: 'yourSecretKey', // Use a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // Session expires in 1 hour
    }),
  );

  app.use(passport.initialize()); // Initialize Passport
  app.use(passport.session()); // Use session for Passport

 
  app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    next();
  });

  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true, // Allow cookies and sessions
  });
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
