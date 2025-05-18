import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IGrpcClientOption } from './interfaces/grpc-client-option.interface';

@Module({})
export class GrpcClientModule {
  static forRootAsync(option: IGrpcClientOption): DynamicModule {
    return {
      module: GrpcClientModule,
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: option.name,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.GRPC,
              options: {
                package: option.package,
                protoPath: join(__dirname, 'protos', `${option.package}.proto`),
                url: configService.get<string>(option.url),
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
