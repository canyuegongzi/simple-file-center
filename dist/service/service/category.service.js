"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_error_code_enum_1 = require("../../config/api-error-code.enum");
const api_exception_1 = require("../../common/error/exceptions/api.exception");
const category_entity_1 = require("../../model/entity/category.entity");
const tree_data_1 = require("../../utils/tree-data");
let CategoryService = class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    getList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryConditionList = ['a.isDelete = :isDelete'];
                if (query.name) {
                    queryConditionList.push('a.name LIKE :name');
                }
                const queryCondition = queryConditionList.join(' AND ');
                const res = yield this.categoryRepository
                    .createQueryBuilder('a')
                    .where(queryCondition, {
                    name: `%${query.name}%`,
                    isDelete: 0,
                })
                    .orderBy('a.name', 'ASC')
                    .skip((query.page - 1) * query.pageSize)
                    .take(query.pageSize)
                    .getManyAndCount();
                return { data: res[0], count: res[1] };
            }
            catch (e) {
                throw new api_exception_1.ApiException(e.errorMessage, api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    creatCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository
                    .createQueryBuilder('c')
                    .insert()
                    .into(category_entity_1.Category)
                    .values([{ name: params.name, code: params.code, desc: params.desc, parentId: params.parentId }])
                    .execute();
            }
            catch (e) {
                throw new api_exception_1.ApiException('操作失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    updateCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository
                    .createQueryBuilder('c')
                    .update(category_entity_1.Category)
                    .set({ name: params.name, code: params.code, parentId: params.parentId })
                    .where('id = :id', { id: params.id })
                    .execute();
            }
            catch (e) {
                throw new api_exception_1.ApiException('操作失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository
                    .createQueryBuilder('c')
                    .update(category_entity_1.Category)
                    .set({ isDelete: 1 })
                    .where('id = :id', { id })
                    .execute();
            }
            catch (e) {
                throw new api_exception_1.ApiException('操作失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    getCategoryTree() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.categoryRepository
                    .createQueryBuilder('c')
                    .getManyAndCount();
                const treeData = tree_data_1.listToTree(res[0], 'id', 'parentId', 'children');
                return { data: treeData, count: res[1] };
            }
            catch (e) {
                throw new api_exception_1.ApiException('查询失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    findOneByName(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.findOne({ code });
        });
    }
    getInfoCateGory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.findOne({ id });
            }
            catch (e) {
                throw new api_exception_1.ApiException('查询失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    getFileListByCate(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!query.cateId) {
                    throw new api_exception_1.ApiException('类别id不能为空', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                }
                const res = yield this.categoryRepository
                    .createQueryBuilder('c')
                    .leftJoinAndSelect('c.files', 'f')
                    .where('c.id = :id', { id: query.cateId })
                    .orderBy('f.name', 'ASC')
                    .skip((query.page - 1) * query.pageSize)
                    .take(query.pageSize)
                    .getManyAndCount();
                return { data: res[0], count: res[1] };
            }
            catch (e) {
                console.log(e);
                throw new api_exception_1.ApiException(e.errorMessage, api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
};
CategoryService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryService);
exports.CategoryService = CategoryService;
