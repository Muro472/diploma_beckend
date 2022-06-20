import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class PostsDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  userToken: string;

  @IsOptional()
  post_hash?: string;

  @Length(3, 100)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdatePostChunkDto {
  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  userToken: string;
}
