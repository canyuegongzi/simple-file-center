import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {mysqlConfig, redisConfig} from './config/config.json';
import {CategoryModule} from './module/category.module';
import {FileModule} from './module/file.module';
import {UploadModule} from './module/upload.module';
import {QiniuModule} from './module/qiniu.module';
import {join} from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(
        {
          type: 'mysql',
          host: mysqlConfig.host,
          port: 3306,
          username: mysqlConfig.userName,
          password: mysqlConfig.password,
          database: 'b_simple_file_center',
          entities: [join(__dirname, '**/**.entity{.ts,.js}')],
          synchronize: true,
        }),
    CategoryModule, FileModule, UploadModule, QiniuModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}
