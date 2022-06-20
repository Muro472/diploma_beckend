import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserDto } from './dto/user.dto';
import { hashPassword } from '../../bll/helpers/Utils';
import { randomUUID } from 'crypto';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    const body = request.body;

    const hashedPassword = await hashPassword(body.password);
    const userToken = `${Date.now()}${randomUUID()}`;
    const isAdmin = false;
    body.password = hashedPassword;
    body.userToken = userToken;
    body.isAdmin = isAdmin;
    next();
  }
}
