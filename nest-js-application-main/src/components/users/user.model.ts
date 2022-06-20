import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { OneToMany } from 'typeorm';
import {PostsModel} from "../posts/posts.model";

@Table({ tableName: 'users' })
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public readonly id: number;

  @Column({ type: DataType.STRING, unique: true })
  public readonly userToken: string;

  @Column({ type: DataType.STRING, unique: true })
  public readonly userName: string;

  @Column({ type: DataType.STRING })
  public password: string;

  @Column({ type: DataType.STRING })
  public readonly description: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  public readonly isAdmin: boolean;

  @OneToMany(() => PostsModel, (post) => post.userToken)
  posts: PostsModel[];
}
