import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Category} from '../model/entity/category.entity';
import {File} from '../model/entity/file.entity';
import {FileController} from '../controller/file.controller';
import {FileService} from '../service/service/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Category, File]),
],
  controllers: [FileController],
  providers: [FileService],
  exports: [],
})
export class FileModule {}
