import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {CreateCategoryDto} from '../../model/DTO/category/create_category.dto';
import {UpdateCategoryDto} from '../../model/DTO/category/update_category.dto';
import {QueryCategoryDtoDto} from '../../model/DTO/category/query_category.dto';
import {listToTree} from '../../utils/tree-data';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  /**
   * 查询分类
   * @param query
   */
  public async getList(query: QueryCategoryDtoDto): Promise<any> {
    try {
      const queryConditionList = ['a.isDelete = :isDelete'];
      if (query.name) {
        queryConditionList.push('a.name LIKE :name');
      }
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.categoryRepository
          .createQueryBuilder('a')
          .where(queryCondition, {
            name: `%${query.name}%`,
            isDelete: 0,
          })
          .orderBy('a.name', 'ASC')
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 创建分类
   * @param params
   */
  public async creatCategory(params: CreateCategoryDto) {
    try {
      return await this.categoryRepository
          .createQueryBuilder('c')
          .insert()
          .into(Category)
          .values([{name: params.name, code: params.code, desc: params.desc, parentId: params.parentId }])
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 更新分类
   * @param params
   */
  public async updateCategory(params: UpdateCategoryDto) {
    try {
      return await this.categoryRepository
          .createQueryBuilder('c')
          .update(Category)
          .set({ name: params.name,  code: params.code, parentId: params.parentId })
          .where('id = :id', { id: params.id })
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 删除分类
   * @param id
   */
  public  async deleteCategory(id: number | string) {
    try {
      return await this.categoryRepository
          .createQueryBuilder('c')
          .update(Category)
          .set({ isDelete: 1})
          .where('id = :id', { id })
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询分类树的数据
   */
  public async getCategoryTree() {
    try {
      const res  = await this.categoryRepository
          .createQueryBuilder('c')
          .getManyAndCount();
      const treeData = listToTree(res[0], 'id', 'parentId', 'children');
      return  { data: treeData, count: res[1]};
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 通过code查询
   * @param name
   */
  public async findOneByName(code: string): Promise<Category> {
    return await this.categoryRepository.findOne({ code });
  }

  /**
   * 查询详情
   * @param id
   */
  public async getInfoCateGory(id: any): Promise<Category> {
    try {
      return await this.categoryRepository.findOne({ id });
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询分类下的文件
   * @param query
   */
  public async getFileListByCate(query: QueryCategoryDtoDto): Promise<any> {
    try {
      if (!query.cateId) {
        throw new ApiException('类别id不能为空', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
      const res = await this.categoryRepository
          .createQueryBuilder('c')
          .leftJoinAndSelect('c.files', 'f')
          .where('c.id = :id', { id: query.cateId})
          .orderBy('f.name', 'ASC')
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      console.log(e);
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }
}
