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
const category_entity_1 = require("../../model/entity/category.entity");
const file_entity_1 = require("../../model/entity/file.entity");
const config_json_1 = require("../../config/config.json");
const data_time_1 = require("../../utils/data-time");
const file_service_1 = require("./file.service");
const api_exception_1 = require("../../common/error/exceptions/api.exception");
const api_error_code_enum_1 = require("../../config/api-error-code.enum");
const url = require("url");
let QiniuService = class QiniuService {
    constructor(fileRepository, categoryRepository, fileService) {
        this.fileRepository = fileRepository;
        this.categoryRepository = categoryRepository;
        this.fileService = fileService;
        this.uploadQiniu = (formUploader, token, filename, req, putExtra) => {
            return new Promise((resolve, reject) => {
                formUploader.put(token, filename, req.file.buffer, putExtra, (respErr, respBody, respInfo) => __awaiter(this, void 0, void 0, function* () {
                    if (respErr) {
                        throw respErr;
                    }
                    if (respInfo.statusCode === 200) {
                        const { originalname, encoding, size, destination } = req.file;
                        const params = { destination: originalname, encoding, size, time: data_time_1.formatDate(), name: originalname, categoryTypeName: originalname.split('.')[1], url: config_json_1.qiniuUploadConfig.persistentNotifyUrl + respBody.key, serverCategory: 1 };
                        try {
                            yield this.fileService.creatFile(params);
                            const qiUrl = config_json_1.qiniuUploadConfig.persistentNotifyUrl + respBody.key;
                            resolve(qiUrl);
                        }
                        catch (e) {
                            const qiUrl = config_json_1.qiniuUploadConfig.persistentNotifyUrl + respBody.key;
                            resolve(qiUrl);
                        }
                    }
                    else {
                        reject(respInfo);
                    }
                }));
            });
        };
    }
    deleteQiniu(params, bucketManager, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let fileInfo;
                try {
                    fileInfo = yield this.getInfoFile(params);
                    const info = url.parse(fileInfo.url, true);
                    if (info.path) {
                        const name = info.path.substr(1);
                        bucketManager.delete(config_json_1.qiniuUploadConfig.scope, name, ((err, respBody, respInfo) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            resolve(true);
                        }));
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
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
    multipleUploadQiniu(formUploader, token, req, putExtra, category, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const files = req.files;
                    const results = [];
                    for (let i = 0; i < files.length; i++) {
                        const filename = `${files[i].originalname.split('.')[0]}.${new Date().getTime()}.${files[i].originalname.split('.')[1]}`;
                        formUploader.put(token, filename, files[i].buffer, putExtra, (respErr, respBody, respInfo) => __awaiter(this, void 0, void 0, function* () {
                            if (respErr) {
                                throw respErr;
                            }
                            if (respInfo.statusCode === 200) {
                                const params = { destination: files[i].originalname, encoding: files[i].encoding, size: files[i].size, userName, time: data_time_1.formatDate(), name: files[i].originalname, categoryTypeName: files[i].originalname.split('.')[1], url: config_json_1.qiniuUploadConfig.persistentNotifyUrl + respBody.key, serverCategory: 1 };
                                results.push(params);
                                if (results.length === files.length) {
                                    const res = yield this.fileService.creatMultipleFile(results, category);
                                    resolve(res);
                                }
                            }
                            else {
                                throw new api_exception_1.ApiException('上传失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                            }
                        }));
                    }
                }
                catch (e) {
                    reject(e);
                    console.log(e);
                }
            }));
        });
    }
};
QiniuService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(file_entity_1.File)),
    __param(1, typeorm_1.InjectRepository(category_entity_1.Category)),
    __param(2, common_1.Inject(file_service_1.FileService)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        file_service_1.FileService])
], QiniuService);
exports.QiniuService = QiniuService;
