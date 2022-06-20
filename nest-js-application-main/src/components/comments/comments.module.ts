import { Module, SerializeOptions } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentsModel } from './comments.model';
import { UserModel } from '../users/user.model';
import { UserModule } from '../users/user.module';

@Module({
  imports: [SequelizeModule.forFeature([CommentsModel, UserModel]), UserModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [],
})
class CommentsModule {}

export { CommentsModule };
