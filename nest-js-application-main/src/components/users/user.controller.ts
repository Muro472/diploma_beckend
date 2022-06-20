import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthDto, UserDto } from './dto/user.dto';

@Controller('/api/users')
class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  public async registerUser(@Body() dto: UserDto) {
    return this.userService.registerUser(dto);
  }

  @Post('/authorize')
  public async authorizeUser(@Body() dto: UserAuthDto) {
    return this.userService.authorizeUser(dto);
  }
}

export { UserController };
