import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {redisConfig} from './config/config';
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
          host: '47.106.104.22',
          // host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: 'root',
          // password: '123456',
          database: 'b_simple_file_center',
          entities: [join(__dirname, '**/**.entity{.ts,.js}')],
          synchronize: true,
        }),
    RedisModule.register(redisConfig),
    CategoryModule, FileModule, UploadModule, QiniuModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}
