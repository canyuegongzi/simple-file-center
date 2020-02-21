import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Category} from '../model/entity/category.entity';
import {CategoryController} from '../controller/category.controller';
import {CategoryService} from '../service/service/category.service';
import {File} from '../model/entity/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Category, File]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [],
})
export class CategoryModule {}
