import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

class Application {
  private readonly PORT: number;
  constructor() {
    this.PORT = +process.env.PORT || 5000;
  }
  public async start() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets(
      join(__dirname, '../../client/dist/static'),
    );
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(this.PORT, () => {
      console.log(`Server is started on PORT=${this.PORT}`);
    });
  }
}

const application = new Application();

application.start().then();
