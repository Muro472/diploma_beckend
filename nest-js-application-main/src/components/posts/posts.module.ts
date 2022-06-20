import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../users/user.model';
import { PostsModel } from './posts.model';
import { FilesModule } from '../files/files.module';
import { PostMappingModel } from './post_mapping.model';

@Module({
  imports: [
    SequelizeModule.forFeature([PostsModel, UserModel, PostMappingModel]),
    FilesModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [],
})
class PostsModule {}

export { PostsModule };
