import {Body, Controller, Get, Inject, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {UploadService} from '../service/service/upload.service';
import config from '../config/config';
import {FileService} from '../service/service/file.service';
import {CreateFileDto} from '../model/DTO/file/create_file.dto';
import {formatDate} from '../utils/data-time';

@Controller('file')
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
  @Post('upload')
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
      const params: CreateFileDto = {
        destination,
        encoding,
        size,
        time: formatDate(),
        name: originalname,
        categoryTypeName: originalname.split('.')[1],
        url: config.host + destination.split('.')[1] + '/' + originalname,
      };
      const res = await this.fileService.creatFile(params);
      return  { code: 200, data: res.identifiers,  message: '文件上传成功' };
    } catch (e) {
      return  { code: 200, data: [],  message: '文件上传失败' };
    }
  }

  /**
   * 单文件上传
   * @param file
   * @param req
   */
  @Post('uploadQiniu')
  public async uploadQiniu(@Req() req) {
    console.log(req);
    // const { originalname, encoding, size, destination} = file;
    // try {
    //   const params: CreateFileDto = {
    //     destination,
    //     encoding,
    //     size,
    //     time: formatDate(),
    //     name: originalname,
    //     categoryTypeName: originalname.split('.')[1],
    //     url: config.host + destination.split('.')[1] + '/' + originalname,
    //   };
    //   const res = await this.fileService.creatFile(params);
    //   return  { code: 200, data: res.identifiers,  message: '文件上传成功' };
    // } catch (e) {
    //   return  { code: 200, data: [],  message: '文件上传失败' };
    // }
  }
}
