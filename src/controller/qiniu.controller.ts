import {Body, Controller, Get, Inject, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {FileService} from '../service/service/file.service';
import * as qiniu from 'qiniu';
import {qiniuUploadConfig} from '../config/config';
import {ApiException} from '../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../config/api-error-code.enum';
import {QiniuService} from '../service/service/qiniu.service';

@Controller('qiniu')
export class QiniuController {
  constructor(
      @Inject(FileService) private readonly fileService: FileService,
      @Inject(QiniuService) private readonly qiniuService: QiniuService,
  ) {}

  /**
   * 单文件上传至七牛云
   * @param file
   * @param req
   */
  @Post('uploadQiniu')
  @UseInterceptors(
      FileInterceptor('file', {
        limits: {
          fieldSize: 8 * 1024 * 1024,
        },
      }),
  )
  public async upload(@Req() req, @Body() body) {
    try {
      const formUploader = new qiniu.form_up.FormUploader(qiniuUploadConfig);
      const putExtra = new qiniu.form_up.PutExtra();
      const filename = `${req.file.originalname.split('.')[0]}.${new Date().getTime()}.${req.file.originalname.split('.')[1]}`;
      let token = '';
      try {
        token = this.fileService.creatQiniuToken().upToken;
      } catch (e) {
        return  { code: 200, data: {},  message: 'token认证失败' };
      }
      try {
        const qiData = await this.qiniuService.uploadQiniu(formUploader, token, filename, req, putExtra);
        return { code: 200, data: qiData,  success: true};
      } catch (e) {
        throw new ApiException('上传失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
    } catch (e) {
      return { code: 200, data: {},  message: e.errorMessage };
    }
  }
}
