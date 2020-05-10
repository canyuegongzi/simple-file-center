import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';
import {Category} from '../../entity/category.entity';

export class CreateFileDto {
  @IsNotEmpty({ message: '名称不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  name: string;

  desc?: string;

  time: string;

  url: string;

  categoryId?: any;

  encoding: string;

  size: any;

  destination: any;

  categoryTypeName?: any;

  serverCategory?: number;

  userName?: string;

  category?: Category;

}
