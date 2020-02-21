import {Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {QueryFileDto} from '../../model/DTO/file/query_file.dto';
import {CreateFileDto} from '../../model/DTO/file/create_file.dto';
import {File} from '../../model/entity/file.entity';
import * as qiniu from 'qiniu';
import {qiniuConfig, qiniuUploadConfig} from '../../config/config';
import {formatDate} from '../../utils/data-time';
import {FileService} from './file.service';
@Injectable()
export class  QiniuService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(FileService) private readonly fileService: FileService,
  ) {}

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
          .where('f.isDelete = :isDelete', { isDelete: 0})
          .orWhere('f.name like :name', { name: `%${query.name}%`})
          .orWhere('c.id = :id', { id: query.cateGoryId})
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

  /**
   * 上传文件到七牛云
   * @param token token
   * @param filename 文件名
   * @param req 请求内容
   * @param putExtra
   */
  public uploadQiniu = (formUploader, token, filename, req, putExtra) => {
    return new Promise((resolve, reject) => {
      formUploader.put(token, filename, req.file.buffer, putExtra, async (respErr, respBody, respInfo) => {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode === 200) {
          const {originalname, encoding, size} = req.file;
          const params: CreateFileDto = {
            destination: originalname,
            encoding,
            size,
            time: formatDate(),
            name: originalname,
            categoryTypeName: originalname.split('.')[1],
            url: qiniuUploadConfig.persistentNotifyUrl + respBody.key,
            serverCategory: 1,
          };
          const qiData = await this.fileService.creatFile(params);
          const qiUrl = qiniuUploadConfig.persistentNotifyUrl + respBody.key;
          resolve(qiUrl);
        } else {
          reject(respInfo);
        }
      });
    });
  }

}
