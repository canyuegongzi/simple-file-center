import {Body, Controller, Get, Inject, Post, Query} from '@nestjs/common';
import {FileService} from '../service/service/file.service';
import {QueryFileDto} from '../model/DTO/file/query_file.dto';
import {CreateFileDto} from '../model/DTO/file/create_file.dto';
import {ApiException} from '../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../config/api-error-code.enum';
import {CreateQiniuDto} from '../model/DTO/qiniuConfig/create_qiniu.dto';

@Controller('file')
export class FileController {
  constructor(
    @Inject(FileService) private readonly fileService: FileService,
  ) {}

  /**
   * 添加文件(mysql地址存储)
   */
  @Post('add')
  public async creatFile(@Body() params: CreateFileDto) {
    try {
      await this.fileService.creatFile(params);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage,  success: false };
    }
  }

  /**
   * 删除文件
   * @param params
   */
  @Post('delete')
  public async deleteFile(@Body('id') params, @Body('isDelFile') isDelFile = 0) {
    try {
      try {
        if (Number(isDelFile) === 1) {
          const delFile = await this.fileService.delDiskFile(params);
        }
        await this.fileService.deleteFile(params, Number(isDelFile));
      } catch (e) {
        throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
      return  { code: 200, success: true, message: '操作成功' };
    } catch (e) {
      return  { code: 200, success: false, message: '操作失败' };
    }
  }

  /**
   * 查询文件列表
   * @param params
   */
  @Get('list')
    public async getList(@Query() params: QueryFileDto) {
    try {
      const res = await this.fileService.getList(params);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, message: '查询失败' };
    }
  }

  /**
   * 查询文件详情
   * @param params
   */
  @Get('info')
  public async getInfo(@Query('id') id) {
    try {
      const res = await this.fileService.getInfoFile(id);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: null, message: e.errorMessage };
    }
  }

  /**
   * 查询文件详情
   * @param params
   */
  @Get('config')
  public async getConfig() {
    try {
      const res = await this.fileService.getConfig();
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: null, message: e.errorMessage };
    }
  }

  /**
   * 查询文件详情
   * @param params
   */
  @Post('editConfig')
  public async editConfig(@Body() params: CreateQiniuDto) {
    try {
      const res = await this.fileService.editConfig(params);
      return  { code: 200, data: res, success: true, message: '更新成功' };
    } catch (e) {
      return  { code: 200, data: null, success: false, message: e.errorMessage };
    }
  }
}
