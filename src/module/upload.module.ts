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
import {join} from "path";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Category, File]),
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: async (req, file, cb) => {
            const dirType: string = fileType(file);
            // await dirExists(`./public/${dirType}`);
            await dirExists(`${join(__dirname, '../public/')}${dirType}`)
            return cb(null, `${join(__dirname, '../public/')}${dirType}`);
        },
        filename: (req, file, cb) => {
            // @ts-ignore
            const filename = `${encodeURI(file.originalname, 'GBK').toString('iso8859-1')}`;
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
