import { UserRole } from 'src/enums/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRefreshTokenEntity } from './user-refresh-token.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER_UNSPECIFIED,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * =================== relations ===================
   */
  @OneToMany(() => UserRefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: UserRefreshTokenEntity[];
  /**
   * =================================================
   */
}
