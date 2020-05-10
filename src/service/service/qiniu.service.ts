import {Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Category} from '../../model/entity/category.entity';
import {CreateFileDto} from '../../model/DTO/file/create_file.dto';
import {File} from '../../model/entity/file.entity';
import {qiniuUploadConfig} from '../../config/config.json';
import {formatDate} from '../../utils/data-time';
import {FileService} from './file.service';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import * as url from 'url';
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
   * 。。
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
          const {originalname, encoding, size, destination} = req.file;
          const params: CreateFileDto = {destination: originalname, encoding, size, time: formatDate(), name: originalname, categoryTypeName: originalname.split('.')[1], url: qiniuUploadConfig.persistentNotifyUrl + respBody.key, serverCategory: 1};
          try {
            await this.fileService.creatFile(params);
            const qiUrl = qiniuUploadConfig.persistentNotifyUrl + respBody.key;
            resolve(qiUrl);
          } catch (e) {
            const qiUrl = qiniuUploadConfig.persistentNotifyUrl + respBody.key;
            resolve(qiUrl);
          }
        } else {
          reject(respInfo);
        }
      });
    });
  }

  /**
   * 删除七牛云文件
   * @param token token
   * @param filename 文件名
   * @param req 请求内容
   * @param putExtra
   */
  public async deleteQiniu(params, bucketManager, token) {
    return new Promise(async (resolve, reject) => {
      let fileInfo: any;
      try {
        fileInfo = await this.getInfoFile(params);
        const info: any = url.parse(fileInfo.url, true);
        if (info.path) {
          const name: string = info.path.substr(1);
          bucketManager.delete(qiniuUploadConfig.scope, name, ((err, respBody, respInfo) => {
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(true);
          }));
        }
      } catch (e) {
        reject(e);
      }
    });
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
   * 。。
   * 上传文件到七牛云(多文件)
   * @param token token
   * @param filename 文件名
   * @param req 请求内容
   * @param putExtra
   */
  public async multipleUploadQiniu(formUploader, token, req, putExtra, category, userName) {
    return new Promise(async (resolve, reject) => {
      try {
        const files = req.files;
        const results = [];
        for (let i = 0; i < files.length; i++ ) {
          const filename = `${files[i].originalname.split('.')[0]}.${new Date().getTime()}.${files[i].originalname.split('.')[1]}`;
          formUploader.put(token, filename, files[i].buffer, putExtra, async (respErr, respBody, respInfo) => {
            if (respErr) {
              throw respErr;
            }
            if (respInfo.statusCode === 200) {
              const params: CreateFileDto = {destination: files[i].originalname, encoding: files[i].encoding, size: files[i].size, userName, time: formatDate(), name: files[i].originalname, categoryTypeName: files[i].originalname.split('.')[1], url: qiniuUploadConfig.persistentNotifyUrl + respBody.key, serverCategory: 1};
              results.push(params);
              if (results.length === files.length) {
                const res = await this.fileService.creatMultipleFile(results, category);
                resolve(res);
              }
            } else {
              throw new ApiException('上传失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
          });
        }
      } catch (e) {
        reject(e);
        console.log(e);
      }
    });
  }
}
