import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Category} from '../model/entity/category.entity';
import {File} from '../model/entity/file.entity';
import {MulterModule} from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import {dirExists, fileType} from '../utils/file';
import {FileService} from '../service/service/file.service';
import {QiniuController} from '../controller/qiniu.controller';
import {QiniuService} from '../service/service/qiniu.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Category, File]),
    MulterModule.register({
      storage: memoryStorage({
        // 配置文件上传后的文件夹路径
        destination: async (req, file, cb) => {
            const dirType: string = fileType(file);
            return cb(null, `/${dirType}`);
        },
        filename: (req, file, cb) => {
          // 在此处自定义保存后的文件名称
            const filename = `${file.originalname.split('.')[0]}.${file.originalname.split('.')[1]}`;
            return cb(null, filename);
        },
      }),
    }),
],
  controllers: [QiniuController],
  providers: [FileService, QiniuService],
  exports: [],
})
export class QiniuModule {}
