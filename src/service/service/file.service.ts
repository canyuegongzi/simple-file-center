import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {QueryFileDto} from '../../model/DTO/file/query_file.dto';
import {CreateFileDto} from '../../model/DTO/file/create_file.dto';
import {File} from '../../model/entity/file.entity';
import * as qiniu from 'qiniu';
import {qiniuConfig} from '../../config/config';
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 创建标签
   * @param params
   */
  public async creatFile(params: CreateFileDto) {
    try {
      let fileCate: Category;
      try {
        fileCate = await this.categoryRepository.findOne({name: params.categoryTypeName});
      } catch (e) {
        throw new ApiException('文件分类错误', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
      return await this.fileRepository
          .createQueryBuilder('f')
          .insert()
          .into(File)
          .values([{name: params.name, serverCategory: params.serverCategory, destination: params.destination, url: params.url, size: params.size, encoding: params.encoding, time: params.time, category: fileCate }])
          .execute();
    } catch (e) {
      console.log(e);
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 删除标签
   * @param recommend
   * @param id
   */
  public async deleteFile(id: number | string) {
    try {
      return await this.fileRepository
          .createQueryBuilder()
          .update(File)
          .set({ isDelete: 1})
          .where('id = :id', { id })
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询标签列表
   * @param query
   */
  public async getList(query: QueryFileDto): Promise<any> {
    try {
      const res = await this.fileRepository
          .createQueryBuilder('f')
          .leftJoinAndSelect('f.category', 'c')
          .where('f.name like :name', { name: `${query.name.length > 2 ? `%${query.name}%` : '%%'}`})
          .andWhere('f.isDelete = :isDelete', { isDelete: 0})
          .orderBy('f.name', 'ASC')
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询详情
   * @param id
   */
  public async getInfoFile(id: any): Promise<File> {
    try {
      return await this.fileRepository.findOne({ id });
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 产生七牛的token
   */
  public creatQiniuToken() {
    try {
      const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
      const putPolicy = new qiniu.rs.PutPolicy(qiniuConfig.options);
      const uploadToken =  putPolicy.uploadToken(mac);
      return { success: true, upToken: uploadToken };
    } catch (e) {
      return { success: false, upToken: '' };
    }
  }

}
