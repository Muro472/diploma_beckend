import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PostsDto, UpdatePostChunkDto } from './dto/posts.dto';

@Controller('/api/posts')
class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/posts-mapping')
  private getPostsMapping() {
    return this.postsService.getPostsMapping();
  }

  @Post('/posts-chunk/:chunk_hash/update-chunk')
  @UseInterceptors(FilesInterceptor('image'))
  private updatePostChunk(
    @Param('chunk_hash') chunk_hash: string,
    @UploadedFiles() file,
    @Body() dto: UpdatePostChunkDto,
  ) {
    return this.postsService.updatePostChunk(chunk_hash, file[0], dto);
  }

  @Get('/posts-chunk/:post_hash')
  private getPostChunk(@Param('post_hash') post_hash: string) {
    return this.postsService.getPostChunk(post_hash);
  }

  @Delete('/posts-chunk/:chunk_hash')
  private deleteChunk(
    @Param('chunk_hash') chunk_hash: string,
    @Query('userToken') userToken: string,
  ) {
    return this.postsService.deleteChunkHash(chunk_hash, userToken);
  }

  @Delete('/post-mapping/:post_hash')
  private deletePost(
    @Param('post_hash') post_hash: string,
    @Query('userToken') userToken: string,
  ) {
    return this.postsService.deletePost(post_hash, userToken);
  }

  @Post('/add-post-pipe')
  @UseInterceptors(FilesInterceptor('image'))
  private addPostPipe(@UploadedFiles() files, @Body() body: PostsDto) {
    return this.postsService.addPostPipe(files, body);
  }
}

export { PostsController };
