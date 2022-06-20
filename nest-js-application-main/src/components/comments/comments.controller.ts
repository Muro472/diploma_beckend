import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import { CommentDto, CommentUpdateDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';

@Controller('/api/comments')
class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Post('/add-comment')
  public async addComment(@Body() dto: CommentDto) {
    return this.commentService.addComment(dto);
  }

  @Get('/get-comments/:post_hash')
  public async getComments(@Param() params) {
    return this.commentService.getComments(params.post_hash);
  }

  @Delete('/delete-comments')
  public async deleteComment(@Query('comment_hash') comment_hash) {
    return this.commentService.deleteComment(comment_hash);
  }

  @Patch('/update-comments')
  public async updateComment(@Body() dto: CommentUpdateDto) {
    return this.commentService.updateComment(dto);
  }
}

export { CommentsController };
