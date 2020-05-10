import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class CreateQiniuDto {
  @IsNotEmpty({ message: '名称不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  accessKey: string;

  @IsNotEmpty({ message: 'secretKey不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  secretKey: string;

  @IsNotEmpty({ message: 'bucket不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  bucket: string;

  @IsNotEmpty({ message: 'scope不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  scope: string;

  @IsNotEmpty({ message: 'expires不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  expires: number;

  origin: string;

  @IsNotEmpty({ message: 'persistentNotifyUrl不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  persistentNotifyUrl: string;
}
