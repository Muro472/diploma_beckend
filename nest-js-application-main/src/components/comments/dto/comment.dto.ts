import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  userToken: string;

  @Length(3, 300)
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  post_hash: string;
}

export class CommentUpdateDto {
  @Length(3, 300)
  @IsNotEmpty()
  @IsString()
  text: string;

  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  comment_hash: string;

  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  userToken: string;
}
