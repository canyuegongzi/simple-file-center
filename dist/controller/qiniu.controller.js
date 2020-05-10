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
const platform_express_1 = require("@nestjs/platform-express");
const file_service_1 = require("../service/service/file.service");
const qiniu = require("qiniu");
const config_json_1 = require("../config/config.json");
const api_exception_1 = require("../common/error/exceptions/api.exception");
const api_error_code_enum_1 = require("../config/api-error-code.enum");
const qiniu_service_1 = require("../service/service/qiniu.service");
let QiniuController = class QiniuController {
    constructor(fileService, qiniuService) {
        this.fileService = fileService;
        this.qiniuService = qiniuService;
    }
    upload(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formUploader = new qiniu.form_up.FormUploader(config_json_1.qiniuUploadConfig);
                const putExtra = new qiniu.form_up.PutExtra();
                const filename = `${req.file.originalname.split('.')[0]}.${new Date().getTime()}.${req.file.originalname.split('.')[1]}`;
                let token = '';
                try {
                    const result = yield this.fileService.creatQiniuToken();
                    token = result.upToken;
                }
                catch (e) {
                    return { code: 200, data: {}, message: 'token认证失败' };
                }
                try {
                    const qiData = yield this.qiniuService.uploadQiniu(formUploader, token, filename, req, putExtra);
                    return { code: 200, data: qiData, success: true };
                }
                catch (e) {
                    throw new api_exception_1.ApiException('上传失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                }
            }
            catch (e) {
                return { code: 200, data: {}, message: e.errorMessage, success: false };
            }
        });
    }
    delete(req, body, params, isDelFile = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mac = new qiniu.auth.digest.Mac(config_json_1.qiniuUploadConfig.accessKey, config_json_1.qiniuUploadConfig.secretKey);
                const config = new qiniu.conf.Config();
                config.zone = qiniu.zone.Zone_z1;
                const bucketManager = new qiniu.rs.BucketManager(mac, config);
                try {
                    const qiData = yield this.qiniuService.deleteQiniu(params, bucketManager, '');
                    console.log(qiData);
                    yield this.fileService.deleteFile([params], Number(isDelFile));
                    return { code: 200, data: qiData, success: true };
                }
                catch (e) {
                    console.log(e);
                    throw new api_exception_1.ApiException('刪除失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                }
            }
            catch (e) {
                return { code: 200, data: {}, message: e.errorMessage, success: false };
            }
        });
    }
    multipleUpload(req, body, category, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formUploader = new qiniu.form_up.FormUploader(config_json_1.qiniuUploadConfig);
                const putExtra = new qiniu.form_up.PutExtra();
                let token = '';
                try {
                    const result = yield this.fileService.creatQiniuToken();
                    token = result.upToken;
                }
                catch (e) {
                    return { code: 200, data: {}, message: 'token认证失败' };
                }
                try {
                    const qiData = yield this.qiniuService.multipleUploadQiniu(formUploader, token, req, putExtra, category, userName);
                    return { code: 200, data: qiData, success: true };
                }
                catch (e) {
                    throw new api_exception_1.ApiException('上传失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                }
            }
            catch (e) {
                return { code: 200, data: {}, message: e.errorMessage, success: false };
            }
        });
    }
};
__decorate([
    common_1.Post('uploadQiniu'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        limits: {
            fieldSize: 8 * 1024 * 1024,
        },
    })),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QiniuController.prototype, "upload", null);
__decorate([
    common_1.Post('deleteFile'),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Body('id')), __param(3, common_1.Body('isDelFile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], QiniuController.prototype, "delete", null);
__decorate([
    common_1.Post('multipleQiniu'),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor('file', 3, {
        limits: {
            fieldSize: 8 * 1024 * 1024,
        },
    })),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Body('category')), __param(3, common_1.Body('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], QiniuController.prototype, "multipleUpload", null);
QiniuController = __decorate([
    common_1.Controller('qiniu'),
    __param(0, common_1.Inject(file_service_1.FileService)),
    __param(1, common_1.Inject(qiniu_service_1.QiniuService)),
    __metadata("design:paramtypes", [file_service_1.FileService,
        qiniu_service_1.QiniuService])
], QiniuController);
exports.QiniuController = QiniuController;
