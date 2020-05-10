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
const file_service_1 = require("../service/service/file.service");
const query_file_dto_1 = require("../model/DTO/file/query_file.dto");
const create_file_dto_1 = require("../model/DTO/file/create_file.dto");
const api_exception_1 = require("../common/error/exceptions/api.exception");
const api_error_code_enum_1 = require("../config/api-error-code.enum");
const create_qiniu_dto_1 = require("../model/DTO/qiniuConfig/create_qiniu.dto");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    creatFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.fileService.creatFile(params);
                return { code: 200, message: '操作成功', success: true };
            }
            catch (e) {
                return { code: 200, message: e.errorMessage, success: false };
            }
        });
    }
    deleteFile(params, isDelFile = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    if (Number(isDelFile) === 1) {
                        const delFile = yield this.fileService.delDiskFile(params);
                    }
                    yield this.fileService.deleteFile(params, Number(isDelFile));
                }
                catch (e) {
                    throw new api_exception_1.ApiException('操作失败', api_error_code_enum_1.ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
                }
                return { code: 200, success: true, message: '操作成功' };
            }
            catch (e) {
                return { code: 200, success: false, message: '操作失败' };
            }
        });
    }
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.fileService.getList(params);
                return { code: 200, data: res, message: '查询成功' };
            }
            catch (e) {
                return { code: 200, message: '查询失败' };
            }
        });
    }
    getInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.fileService.getInfoFile(id);
                return { code: 200, data: res, message: '查询成功' };
            }
            catch (e) {
                return { code: 200, data: null, message: e.errorMessage };
            }
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.fileService.getConfig();
                return { code: 200, data: res, message: '查询成功' };
            }
            catch (e) {
                return { code: 200, data: null, message: e.errorMessage };
            }
        });
    }
    editConfig(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.fileService.editConfig(params);
                return { code: 200, data: res, success: true, message: '更新成功' };
            }
            catch (e) {
                return { code: 200, data: null, success: false, message: e.errorMessage };
            }
        });
    }
};
__decorate([
    common_1.Post('add'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_file_dto_1.CreateFileDto]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "creatFile", null);
__decorate([
    common_1.Post('delete'),
    __param(0, common_1.Body('id')), __param(1, common_1.Body('isDelFile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "deleteFile", null);
__decorate([
    common_1.Get('list'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_file_dto_1.QueryFileDto]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getList", null);
__decorate([
    common_1.Get('info'),
    __param(0, common_1.Query('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getInfo", null);
__decorate([
    common_1.Get('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getConfig", null);
__decorate([
    common_1.Post('editConfig'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_qiniu_dto_1.CreateQiniuDto]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "editConfig", null);
FileController = __decorate([
    common_1.Controller('file'),
    __param(0, common_1.Inject(file_service_1.FileService)),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
exports.FileController = FileController;
