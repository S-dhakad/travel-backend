import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global logging middleware for debugging
  app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
    next();
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('GearGig API')
    .setDescription('API documentation for GearGig backend')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Handshake')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Get ConfigService to access .env values correctly
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 7867;
  await app.listen(port, '0.0.0.0');
  console.log(`[DEBUG] Backend server running on port: ${port}`);

}
bootstrap();
