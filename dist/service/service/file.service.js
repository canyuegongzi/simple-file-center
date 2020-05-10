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
const file_entity_1 = require("../../model/entity/file.entity");
const qiniu = require("qiniu");
const fs = require("fs");
const url = require("url");
const config_json_1 = require("../../config/config.json");
const path_1 = require("path");
let FileService = class FileService {
    constructor(fileRepository, categoryRepository) {
        this.fileRepository = fileRepository;
        this.categoryRepository = categoryRepository;
    }
    creatFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileCate;
                try {
                    fileCate = yield this.categoryRepository.findOne({ name: params.categoryTypeName });
                }
                catch (e) {
                    throw new api_exception_1.ApiException('文件分类错误', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                }
                return yield this.fileRepository
                    .createQueryBuilder('f')
                    .insert()
                    .into(file_entity_1.File)
                    .values([{ name: params.name, serverCategory: params.serverCategory, destination: params.destination, url: params.url, size: params.size, encoding: params.encoding, time: params.time, category: fileCate }])
                    .execute();
            }
            catch (e) {
                throw new api_exception_1.ApiException(e.errorMessage, api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    creatMultipleFile(fileList, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileCate;
                try {
                    fileCate = yield this.categoryRepository.findOne({ id: Number(category) });
                }
                catch (e) {
                    throw new api_exception_1.ApiException('文件分类错误', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                }
                const newList = fileList.map((item) => {
                    return Object.assign({}, item, { category: fileCate });
                });
                const res = yield this.fileRepository
                    .createQueryBuilder('f')
                    .insert()
                    .into(file_entity_1.File)
                    .values(newList)
                    .execute();
                const fileURL = fileList.map((item, index) => {
                    return { url: item.url, name: item.name };
                });
                return fileURL;
            }
            catch (e) {
                console.log(e);
                throw new api_exception_1.ApiException(e.errorMessage, api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    deleteFile(ids, isDelFile = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isDelFile === 0) {
                    return yield this.fileRepository
                        .createQueryBuilder()
                        .update(file_entity_1.File)
                        .set({ isDelete: 1 })
                        .whereInIds(ids)
                        .execute();
                }
                else {
                    return yield this.fileRepository
                        .createQueryBuilder()
                        .delete()
                        .from(file_entity_1.File)
                        .whereInIds(ids)
                        .execute();
                }
            }
            catch (e) {
                console.log(e);
                throw new api_exception_1.ApiException('操作失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    getList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.fileRepository
                    .createQueryBuilder('f')
                    .leftJoinAndSelect('f.category', 'c')
                    .where('f.name like :name', { name: `${query.name.length > 2 ? `%${query.name}%` : '%%'}` })
                    .andWhere('f.isDelete = :isDelete', { isDelete: 0 })
                    .orderBy('f.time', 'DESC')
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
    getInfoFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.fileRepository.findOne({ id });
            }
            catch (e) {
                throw new api_exception_1.ApiException('查询失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    creatQiniuToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mac = new qiniu.auth.digest.Mac(config_json_1.qiniuUploadConfig.accessKey, config_json_1.qiniuUploadConfig.secretKey);
                const putPolicy = new qiniu.rs.PutPolicy({
                    scope: config_json_1.qiniuUploadConfig.scope,
                    expires: Number(config_json_1.qiniuUploadConfig.expires),
                });
                const uploadToken = yield putPolicy.uploadToken(mac);
                return { success: true, upToken: uploadToken };
            }
            catch (e) {
                return { success: false, upToken: '' };
            }
        });
    }
    delDiskFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileInfo;
            try {
                fileInfo = yield this.getInfoFile(params);
                const info = url.parse(fileInfo.url, true);
                if (info.path) {
                    fs.unlink(path_1.join(__dirname, '../../') + info.path, (error) => {
                        console.log(error);
                        return { success: true, data: error };
                    });
                }
            }
            catch (e) {
                throw new api_exception_1.ApiException('文件不存在', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return config_json_1.qiniuUploadConfig;
            }
            catch (e) {
                throw new api_exception_1.ApiException('获取配置失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
            }
        });
    }
    editConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    fs.readFile(path_1.join(__dirname, '../../', 'config/config.json'), (err, data) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        const configData = data.toString();
                        const jsonData = JSON.parse(configData);
                        jsonData.qiniuUploadConfig = Object.assign({}, jsonData.qiniuUploadConfig, config);
                        const str = JSON.stringify(jsonData);
                        fs.writeFile(path_1.join(__dirname, '../../', 'config/config.json'), str, (errs) => {
                            if (errs) {
                                reject(errs);
                            }
                            resolve({ success: true });
                        });
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
};
FileService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(file_entity_1.File)),
    __param(1, typeorm_1.InjectRepository(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FileService);
exports.FileService = FileService;
