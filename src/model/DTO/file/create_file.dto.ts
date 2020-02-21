import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class CreateFileDto {
  @IsNotEmpty({ message: '名称不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  name: string;

  desc?: any;

  time: any;

  url: string;

  categoryId?: any;

  encoding: any;

  size: any;

  destination: any;

  categoryTypeName?: any;

  serverCategory?: number;

}
