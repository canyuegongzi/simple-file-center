import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Category} from '../model/entity/category.entity';
import {File} from '../model/entity/file.entity';
import {MulterModule} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {UploadController} from '../controller/upload.controller';
import {UploadService} from '../service/service/upload.service';
import {dirExists, fileType} from '../utils/file';
import {FileService} from '../service/service/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Category, File]),
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: async (req, file, cb) => {
            const dirType: string = fileType(file);
            await dirExists(`./public/${dirType}`);
            return cb(null, `./public/${dirType}`);
        },
        filename: (req, file, cb) => {
          // 在此处自定义保存后的文件名称
            const filename = `${file.originalname.split('.')[0]}.${file.originalname.split('.')[1]}`;
            return cb(null, filename);
        },
      }),
    }),
],
  controllers: [UploadController],
  providers: [UploadService, FileService],
  exports: [],
})
export class UploadModule {}
