import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
} from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  // (공통) EntityManager가 주입되지 않을 경우, 기본 EntityManager를 생성합니다.
  // 이 매개변수는 트랜잭션 내에서 사용되며, 여러 작업을 하나의 트랜잭션으로 묶어야 할 때 사용됩니다.
  getUser(
    where: FindOptionsWhere<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<UserEntity | null> {
    const em = entityManager ?? this.dataSource.createEntityManager();
    return em.findOneBy(UserEntity, where);
  }

  async createUser(
    createData: DeepPartial<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<UserEntity> {
    const em = entityManager ?? this.dataSource.createEntityManager();

    if (!createData.email) {
      throw new BadRequestException('email is required');
    }
    await this.checkEmailDuplicate(createData.email, undefined, em);

    const user = em.create(UserEntity, createData);

    return em.save(UserEntity, user);
  }

  async updateUser(
    updateData: DeepPartial<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<UserEntity> {
    const em = entityManager ?? this.dataSource.createEntityManager();

    const { id, ...filteredUpdateData } = updateData;
    const user = await this.getUser({ id }, em);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (filteredUpdateData.email) {
      await this.checkEmailDuplicate(filteredUpdateData.email, id, em);
    }

    em.merge(UserEntity, user, filteredUpdateData);
    return em.save(UserEntity, user);
  }

  async deleteUser(id: string, entityManager?: EntityManager): Promise<void> {
    const em = entityManager ?? this.dataSource.createEntityManager();
    await em.delete(UserEntity, id);
  }

  private async checkEmailDuplicate(
    email: string,
    excludeUserId?: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    const em = entityManager ?? this.dataSource.createEntityManager();
    const existingUser = await this.getUser({ email }, em);

    if (existingUser && existingUser.id !== excludeUserId) {
      throw new ConflictException('conflict user email');
    }
  }
}
