import { RmqService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const appName = process.env.APP_NAME;

  const documentConfig = new DocumentBuilder()
    .setTitle(`${appName} Service`)
    .setDescription(`${appName} Service API description`)
    .setVersion('1.0')
    .addTag(appName)
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup('docs', app, document);

  const queryName = process.env.AUTH_QUEUE;
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(queryName, true));
  await app.startAllMicroservices();

  const port = process.env.PORT;
  await app.listen(port);
  console.log(`${appName} is running on ${port}`);
}
bootstrap();
