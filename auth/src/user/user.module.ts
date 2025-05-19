import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRefreshTokenEntity } from './entities/user-refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRefreshTokenEntity])],
})
export class UserModule {}
