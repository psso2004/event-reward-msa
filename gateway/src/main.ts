import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JoiPipe } from 'nestjs-joi';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new JoiPipe());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
