import { Injectable } from '@nestjs/common';
import { UserAuthDto, UserDto } from './dto/user.dto';
import { UserModel } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Responses } from '../../bll/helpers/Responses';
import { Exceptions } from '../../bll/helpers/Exceptions';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { isValidPassword } from '../../bll/helpers/Utils';
import { UserModule } from './user.module';
import { classToPlain } from 'class-transformer';

@Injectable()
class UserService {
  constructor(
    @InjectModel(UserModel) private userRepository: typeof UserModel,
  ) {}

  public async registerUser(dto: UserDto) {
    try {
      // this.userRepository.sequelize.query()
      const user = await this.userRepository.create({ ...dto });
      return Responses.statusOkWithData(user);
    } catch (ex) {
      console.log('Register user ex', ex);
      return Responses.statusAny(
        StatusCodes.FORBIDDEN,
        Exceptions.isExistsConstraintError(
          ex.toString(),
          'User',
        ) as ReasonPhrases,
      );
    }
  }

  public async authorizeUser({ userName, password }: UserAuthDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { userName },
      });
      const isValidPass = await isValidPassword(password, user.password);
      if (user && isValidPass) {
        const plainUser = classToPlain<UserModel>(user).dataValues;
        delete plainUser.password;
        return Responses.statusOkWithData(plainUser);
      }
      return Responses.statusAny(
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN,
      );
    } catch (ex) {
      console.log('authorizeUser ex', ex);
      return Responses.statusAny(
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN,
      );
    }
  }
}

export { UserService };
