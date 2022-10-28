import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  //Setting pino logger as application level default logger
  app.useLogger(app.get(Logger));

  //Enabling CORS
  app.enableCors();

  const logger = new PinoLogger({});
  logger.setContext('NestBootsrap');

  const port = process.env.PORT || 3000;

  //Initializing server
  await app.listen(port, () =>
    logger.info(`Application started on port ${port}`),
  );
}
bootstrap();
