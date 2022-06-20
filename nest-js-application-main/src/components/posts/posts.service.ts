import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostsModel } from './posts.model';
import { CommentsModel } from '../comments/comments.model';
import { PostsDto, UpdatePostChunkDto } from './dto/posts.dto';
import { Responses } from '../../bll/helpers/Responses';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { FilesService } from '../files/files.service';
import { randomUUID } from 'crypto';
import { UserModel } from '../users/user.model';
import { PostMappingModel } from './post_mapping.model';

@Injectable()
class PostsService {
  constructor(
    @InjectModel(PostsModel)
    private postsRepository: typeof PostsModel,

    @InjectModel(PostMappingModel)
    private postMappingRepository: typeof PostMappingModel,

    @InjectModel(UserModel)
    private userRepository: typeof UserModel,
    private filesService: FilesService,
  ) {}

  private checkIsValidUser = async (userToken) => {
    try {
      const user = await this.userRepository.findOne({ where: { userToken } });
      if (user.isAdmin) {
        return true;
      }
    } catch (ex) {
      return false;
    }
  };

  public async updatePostChunk(
    chunk_hash: string,
    file: any,
    dto: UpdatePostChunkDto,
  ) {
    try {
      const isAdmin = this.checkIsValidUser(dto.userToken);
      if (!isAdmin) {
        return Responses.statusAnyWithMessage(
          StatusCodes.FORBIDDEN,
          ReasonPhrases.FORBIDDEN,
          `You don't have access`,
        );
      }
      const chunk = await this.postsRepository.findOne({
        where: { post_chunk_hash: chunk_hash },
      });
      if (!chunk) {
        return Responses.statusAny(
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST,
        );
      }
      const path = await this.filesService.updateFile(
        file,
        chunk.post_hash,
        chunk.image,
      );
      await this.postsRepository.update(
        {
          ...(dto.content && { content: dto.content }),
          ...(dto.title && { title: dto.title }),
          ...(path !== '' && { image: path }),
        },
        { where: { post_chunk_hash: chunk_hash } },
      );
      return Responses.statusOkWithData({
        post_hash: chunk.post_hash,
        image: path,
        ...dto,
      });
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async getPostsMapping() {
    try {
      const posts = await this.postMappingRepository.findAll();
      return Responses.statusOkWithData(posts);
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async deleteChunkHash(chunk_hash: string, userToken: string) {
    try {
      const isAdmin = this.checkIsValidUser(userToken);
      if (!isAdmin) {
        return Responses.statusAnyWithMessage(
          StatusCodes.FORBIDDEN,
          ReasonPhrases.FORBIDDEN,
          `You don't have access`,
        );
      }
      const chunk = await this.postsRepository.findOne({
        where: { post_chunk_hash: chunk_hash },
      });
      if (chunk !== void 0 && chunk !== null) {
        await this.postsRepository.destroy({
          where: { post_chunk_hash: chunk_hash },
        });
        const isRemoved = await this.filesService.removeFile(
          chunk.post_hash,
          chunk.image,
        );
        console.log(`FILE: ${chunk.image} was REMOVED?:${isRemoved}`);
      }
      return Responses.statusOkWithoutData();
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async deletePost(post_hash: string, userToken: string) {
    try {
      const isAdmin = this.checkIsValidUser(userToken);
      if (!isAdmin) {
        return Responses.statusAnyWithMessage(
          StatusCodes.FORBIDDEN,
          ReasonPhrases.FORBIDDEN,
          `You don't have access`,
        );
      }
      const mapping = await this.postMappingRepository.findOne({
        where: { post_hash: post_hash },
      });
      if (mapping !== void 0 && mapping !== null) {
        await this.postMappingRepository.destroy({
          where: { post_hash: post_hash },
        });
        const isRemoved = await this.filesService.removeFolder(
          mapping.post_hash,
        );
        console.log(`POST_FOLDER: ${post_hash} was REMOVED?:${isRemoved}`);
        const removePost = await this.postsRepository.destroy({
          where: { post_hash },
        });
        return Responses.statusOkWithData({ affected: removePost });
      }
      return Responses.statusAny(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async getPostChunk(post_hash: string) {
    try {
      const posts = await this.postsRepository.findAll({
        where: { post_hash },
      });
      return Responses.statusOkWithData(posts);
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }

  public async addPostPipe(file: any, body: PostsDto) {
    try {
      const isAdmin = this.checkIsValidUser(body.userToken);
      if (!isAdmin) {
        return Responses.statusAnyWithMessage(
          StatusCodes.FORBIDDEN,
          ReasonPhrases.FORBIDDEN,
          `You don't have access`,
        );
      }
      const post_hash = body.post_hash || `posts_${Date.now()}_${randomUUID()}`;
      const post_chunk_hash = `chunk${Date.now()}_${randomUUID()}`;

      const fileName = await this.filesService.createFile(file, post_hash);
      const post_body: PostBody = {
        image: fileName,
        content: body.content,
        userToken: body.userToken,
        post_hash: post_hash,
        title: body.title,
        post_chunk_hash: post_chunk_hash,
      };

      if (!body.post_hash) {
        const post_mapping_body = {
          userToken: body.userToken,
          post_hash: post_hash,
          title: body.title,
        };
        await this.postMappingRepository.create(post_mapping_body);
      }
      await this.postsRepository.create(post_body as any);
      return Responses.statusOkWithData({
        post_hash,
      });
    } catch (ex) {
      return Responses.statusAnyWithMessage(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        ex.toString() || '',
      );
    }
  }
}

export { PostsService };
