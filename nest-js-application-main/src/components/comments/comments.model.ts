import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/user.model';

@Table({ tableName: 'comments' })
export class CommentsModel extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public readonly id: number;

  @Column({ type: DataType.STRING, unique: false })
  public readonly userToken: string;

  @Column({ type: DataType.TEXT })
  public readonly userName: string;

  @Column({ type: DataType.TEXT })
  public readonly text: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  public readonly post_hash: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  public readonly comment_hash: string;

  // @BelongsTo(() => UserModel, 'userToken')
  // UserData: UserModel;
}
