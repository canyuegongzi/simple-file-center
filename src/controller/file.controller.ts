import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import {FileService} from '../service/service/file.service';
import {QueryFileDto} from '../model/DTO/file/query_file.dto';
import {CreateFileDto} from '../model/DTO/file/create_file.dto';

@Controller('file')
export class FileController {
  constructor(
    @Inject(FileService) private readonly fileService: FileService,
  ) {}

  /**
   * 添加文件
   */
  @Post('add')
  public async creatFile(@Body() params: CreateFileDto) {
    try {
      const res = await this.fileService.creatFile(params);
      return  { code: 200, message: '操作成功' };
    } catch (e) {
      return  { code: 200, message: '操作失败' };
    }
  }

  /**
   * 删除文件
   * @param params
   */
  @Post('delete')
  public async deleteFile(@Body('id') params) {
    try {
      const res = await this.fileService.deleteFile(params);
      return  { code: 200, message: '操作成功' };
    } catch (e) {
      return  { code: 200, message: '操作失败' };
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
}
