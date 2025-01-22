import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//prefijos globales para la url por ejemplo localhost:3000/api/pokemon
  app.setGlobalPrefix('api/v2')

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
