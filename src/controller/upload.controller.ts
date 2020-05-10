import {Body, Controller, Get, Inject, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {UploadService} from '../service/service/upload.service';
import {config} from '../config/config.json';
import {FileService} from '../service/service/file.service';
import {CreateFileDto} from '../model/DTO/file/create_file.dto';
import {formatDate} from '../utils/data-time';

@Controller('upload')
export class UploadController {
  constructor(
    @Inject(UploadService) private readonly uploadService: UploadService,
    @Inject(FileService) private readonly fileService: FileService,
  ) {}

  /**
   * 单文件上传
   * @param file
   * @param req
   */
  @Post('add')
  @UseInterceptors(
      FileInterceptor('file', {
        limits: {
          fieldSize: 8 * 1024 * 1024,
        },
      }),
  )
  public async upload(@UploadedFile() file: any, @Req() req) {
    const { originalname, encoding, size, destination} = file;
    try {
      const dd  = destination.split('/');
      const type = dd[dd.length - 1];
      const params: any = {destination, encoding, size, time: formatDate(), name: originalname, categoryTypeName: originalname.split('.')[1], url: config.host + '/public/' + type + '/' + originalname};
      const res = await this.fileService.creatFile(params);
      return  { code: 200, data: params.url,  message: '文件上传成功', success: true };
    } catch (e) {
      return  { code: 200, data: [],  message: '文件上传失败', success: false };
    }
  }

  /**
   * 单文件上传
   * @param file
   * @param req
   */
  @Post('multipleDisk')
  @UseInterceptors(
      FilesInterceptor('file', 3, {
        limits: {
          fieldSize: 8 * 1024 * 1024,
        },
      }),
  )
  public async multipleDisk(@UploadedFiles() files: any, @Req() req, @Body('category') category, @Body('userName') userName) {
    const fileList: any = files.map((item: any, index: number) => {
      const dd  = item.destination.split('/');
      const type = dd[dd.length - 1];
      return {destination: item.destination, encoding: item.encoding, size: item.size, time: formatDate(), name: item.originalname, userName, categoryTypeName: item.originalname.split('.')[1], url: config.host + '/public/' + type + '/' + item.originalname};
    })
    try {
      const res = await this.fileService.creatMultipleFile(fileList, category);
      return  { code: 200, data: res,  message: '文件上传成功', success: true };
    } catch (e) {
      return  { code: 200, data: [],  message: '文件上传失败', success: false };
    }
  }
}
