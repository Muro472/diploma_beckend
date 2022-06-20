import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/user.model';

@Table({ tableName: 'posts' })
export class PostsModel extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public readonly id: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING, unique: false })
  public readonly userToken: string;

  @Column({ type: DataType.STRING })
  public readonly image: string;

  @Column({ type: DataType.STRING })
  public readonly content: string;

  @Column({ type: DataType.TEXT })
  public readonly post_hash: string;

  @Column({ type: DataType.TEXT })
  public readonly title: string;

  @Column({ type: DataType.TEXT })
  public readonly post_chunk_hash: string;
}
