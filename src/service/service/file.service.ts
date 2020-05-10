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
import * as fs from 'fs';
import * as url from 'url';
import {qiniuUploadConfig} from '../../config/config.json';
import {join} from 'path';
import {CreateQiniuDto} from '../../model/DTO/qiniuConfig/create_qiniu.dto';
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 添加文件（mysql）
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
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 添加文件（mysql）
   * @param params
   */
  public async creatMultipleFile(fileList: CreateFileDto[], category: number | string) {
    try {
      let fileCate: Category;
      try {
        fileCate = await this.categoryRepository.findOne({id: Number(category)});
      } catch (e) {
        throw new ApiException('文件分类错误', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
      const newList: any = fileList.map((item: CreateFileDto) => {
        return {...item, category: fileCate };
      });
      const res = await this.fileRepository
          .createQueryBuilder('f')
          .insert()
          .into(File)
          .values(newList)
          .execute();
      const fileURL = fileList.map((item: any, index: number) => {
        return {url: item.url, name: item.name};
      });
      return fileURL;
    } catch (e) {
      console.log(e)
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 删除文件
   * @param id: 删除文件id
   * @param isDelFile: 是否删除远程文件（0：否 1：是）
   * @param id
   */
  public async deleteFile(ids: Array< number | string>, isDelFile: number = 0) {
    try {
      if (isDelFile === 0) {
        return await this.fileRepository
            .createQueryBuilder()
            .update(File)
            .set({ isDelete: 1})
            .whereInIds(ids)
            .execute();
      } else {
        return await this.fileRepository
            .createQueryBuilder()
            .delete()
            .from(File)
            .whereInIds(ids)
            .execute();
      }
    } catch (e) {
      console.log(e);
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
          .orderBy('f.time', 'DESC')
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
  public async creatQiniuToken() {
    try {
      const mac = new qiniu.auth.digest.Mac(qiniuUploadConfig.accessKey, qiniuUploadConfig.secretKey);
      const putPolicy = new qiniu.rs.PutPolicy({
          scope: qiniuUploadConfig.scope,
          expires: Number(qiniuUploadConfig.expires),
      });
      const uploadToken = await putPolicy.uploadToken(mac);
      return { success: true, upToken: uploadToken };
    } catch (e) {
      return { success: false, upToken: '' };
    }
  }

  /**
   * 刪除本地的文件
   */
  public async delDiskFile(params: any) {
    let fileInfo: any;
    try {
      fileInfo = await this.getInfoFile(params);
      const info = url.parse(fileInfo.url, true);
      if (info.path) {
        fs.unlink(join(__dirname, '../../') + info.path, (error) => {
          console.log(error);
          return { success: true, data: error};
        });
      }
    } catch (e) {
      throw new ApiException('文件不存在', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 获取配置文件
   */
  public async getConfig() {
    try {
      return qiniuUploadConfig;
    } catch (e) {
      throw new ApiException('获取配置失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 修改配置
   */
  public async editConfig(config: CreateQiniuDto) {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(join(__dirname, '../../', 'config/config.json'), (err, data) =>  {
          if (err) {
            console.log(err);
            reject(err);
          }
          const configData = data.toString();
          const jsonData: any = JSON.parse(configData);
          jsonData.qiniuUploadConfig = {...jsonData.qiniuUploadConfig, ...config};
          const str: string = JSON.stringify(jsonData);
          fs.writeFile(join(__dirname, '../../', 'config/config.json'), str, (errs) =>  {
            if (errs) {
              reject(errs);
            }
            resolve({success: true});
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
