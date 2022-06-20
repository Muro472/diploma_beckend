import { Injectable } from '@nestjs/common';
import { CommentDto, CommentUpdateDto } from './dto/comment.dto';
import { UserService } from '../users/user.service';
import { InjectModel } from '@nestjs/sequelize';
import { CommentsModel } from './comments.model';
import { randomUUID } from 'crypto';
import { Responses } from '../../bll/helpers/Responses';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UserModel } from '../users/user.model';

@Injectable()
class CommentsService {
  constructor(
    @InjectModel(CommentsModel)
    private commentsRepository: typeof CommentsModel,

    @InjectModel(UserModel)
    private userRepository: typeof UserModel,
  ) {}
  public async updateComment(dto: CommentUpdateDto) {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { comment_hash: dto.comment_hash },
      });
      const user = await this.userRepository.findOne({
        where: { userToken: dto.userToken },
      });
      if (!user || comment.userToken !== dto.userToken) {
        return Responses.statusAny(
          StatusCodes.FORBIDDEN,
          ReasonPhrases.FORBIDDEN,
        );
      }
      await this.commentsRepository.update(
        { text: dto.text },
        { where: { comment_hash: dto.comment_hash } },
      );
      return Responses.statusOkWithoutData();
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async deleteComment(comment_hash: string) {
    try {
      await this.commentsRepository.destroy({
        where: { comment_hash },
      });
      return Responses.statusOkWithoutData();
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async getComments(post_hash) {
    try {
      const comments = await this.commentsRepository.findAll({
        where: { post_hash },
      });
      return Responses.statusOkWithData(comments);
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async addComment(dto: CommentDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { userToken: dto.userToken },
      });
      const comment_hash = `comment_${Date.now()}${randomUUID()}`;
      const comment = {
        ...dto,
        comment_hash,
        userName: user.userName,
      };
      const newComment = await this.commentsRepository.create(comment);
      return Responses.statusOkWithData(newComment);
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }
}

export { CommentsService };
