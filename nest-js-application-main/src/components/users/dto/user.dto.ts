import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UserDto {
  @Length(3, 100)
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @Length(3, 100)
  @IsString()
  description?: string;

  userToken?: string;
  isAdmin?: boolean;
}

export class UserAuthDto {
  @Length(3, 100)
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Length(3, 100)
  @IsNotEmpty()
  @IsString()
  password: string;
}
