import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const migrationsDir = process.env.MIGRATIONS_DIR || './migrations/*{.ts,.js}';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'pkk',
  password: 'pkkPassword!23',
  database: 'user-rdb',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [migrationsDir],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
});
