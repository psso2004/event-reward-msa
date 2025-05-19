import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRefreshTokenEntity } from './entities/user-refresh-token.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRefreshTokenEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
