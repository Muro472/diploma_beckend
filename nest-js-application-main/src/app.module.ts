import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './components/users/user.module';
import { AppLog } from './bll/AppLog';
import { UserModel } from './components/users/user.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostsModel } from './components/posts/posts.model';
import {PostsController} from "./components/posts/posts.controller";
import {PostsModule} from "./components/posts/posts.module";
import {CommentsModule} from "./components/comments/comments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [UserModel, PostsModel],
      autoLoadModels: true,
      logging: AppLog.logSequel,
    }),
    UserModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
