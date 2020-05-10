import {Body, Controller, Get, Inject, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {FileService} from '../service/service/file.service';
import * as qiniu from 'qiniu';
import {qiniuUploadConfig} from '../config/config.json';
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
        const result = await this.fileService.creatQiniuToken();
        token = result.upToken;
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
      return { code: 200, data: {},  message: e.errorMessage, success: false };
    }
  }

    /**
     * 删除七牛云文件
     * @param file
     * @param req
     */
    @Post('deleteFile')
    public async delete(@Req() req, @Body() body, @Body('id') params,  @Body('isDelFile') isDelFile = 1) {
        try {
            const mac = new qiniu.auth.digest.Mac(qiniuUploadConfig.accessKey, qiniuUploadConfig.secretKey);
            const config = new qiniu.conf.Config();
            // @ts-ignore
            config.zone = qiniu.zone.Zone_z1;
            const bucketManager = new qiniu.rs.BucketManager(mac, config);
            try {
                const qiData = await this.qiniuService.deleteQiniu(params, bucketManager, '');
                console.log(qiData);
                await this.fileService.deleteFile([params], Number(isDelFile));
                return { code: 200, data: qiData,  success: true};
            } catch (e) {
                console.log(e)
                throw new ApiException('刪除失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        } catch (e) {
            return { code: 200, data: {},  message: e.errorMessage, success: false };
        }
    }

    /**
     * 单文件上传至七牛云
     * @param file
     * @param req
     */
    @Post('multipleQiniu')
    @UseInterceptors(
        FilesInterceptor('file', 3, {
            limits: {
                fieldSize: 8 * 1024 * 1024,
            },
        }),
    )
    public async multipleUpload(@Req() req, @Body() body, @Body('category') category, @Body('userName') userName) {
        try {
            const formUploader = new qiniu.form_up.FormUploader(qiniuUploadConfig);
            const putExtra = new qiniu.form_up.PutExtra();
            let token = '';
            try {
                const result = await this.fileService.creatQiniuToken();
                token = result.upToken;
            } catch (e) {
                return  { code: 200, data: {},  message: 'token认证失败' };
            }
            try {
                const qiData = await this.qiniuService.multipleUploadQiniu(formUploader, token, req, putExtra, category, userName);
                return { code: 200, data: qiData,  success: true};
            } catch (e) {
                throw new ApiException('上传失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        } catch (e) {
            return { code: 200, data: {},  message: e.errorMessage, success: false };
        }
    }
}
