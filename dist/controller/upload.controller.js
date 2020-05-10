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
const upload_service_1 = require("../service/service/upload.service");
const config_json_1 = require("../config/config.json");
const file_service_1 = require("../service/service/file.service");
const data_time_1 = require("../utils/data-time");
let UploadController = class UploadController {
    constructor(uploadService, fileService) {
        this.uploadService = uploadService;
        this.fileService = fileService;
    }
    upload(file, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { originalname, encoding, size, destination } = file;
            try {
                const dd = destination.split('/');
                const type = dd[dd.length - 1];
                const params = { destination, encoding, size, time: data_time_1.formatDate(), name: originalname, categoryTypeName: originalname.split('.')[1], url: config_json_1.config.host + '/public/' + type + '/' + originalname };
                const res = yield this.fileService.creatFile(params);
                return { code: 200, data: params.url, message: '文件上传成功', success: true };
            }
            catch (e) {
                return { code: 200, data: [], message: '文件上传失败', success: false };
            }
        });
    }
    multipleDisk(files, req, category, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileList = files.map((item, index) => {
                const dd = item.destination.split('/');
                const type = dd[dd.length - 1];
                return { destination: item.destination, encoding: item.encoding, size: item.size, time: data_time_1.formatDate(), name: item.originalname, userName, categoryTypeName: item.originalname.split('.')[1], url: config_json_1.config.host + '/public/' + type + '/' + item.originalname };
            });
            try {
                const res = yield this.fileService.creatMultipleFile(fileList, category);
                return { code: 200, data: res, message: '文件上传成功', success: true };
            }
            catch (e) {
                return { code: 200, data: [], message: '文件上传失败', success: false };
            }
        });
    }
};
__decorate([
    common_1.Post('add'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        limits: {
            fieldSize: 8 * 1024 * 1024,
        },
    })),
    __param(0, common_1.UploadedFile()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "upload", null);
__decorate([
    common_1.Post('multipleDisk'),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor('file', 3, {
        limits: {
            fieldSize: 8 * 1024 * 1024,
        },
    })),
    __param(0, common_1.UploadedFiles()), __param(1, common_1.Req()), __param(2, common_1.Body('category')), __param(3, common_1.Body('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "multipleDisk", null);
UploadController = __decorate([
    common_1.Controller('upload'),
    __param(0, common_1.Inject(upload_service_1.UploadService)),
    __param(1, common_1.Inject(file_service_1.FileService)),
    __metadata("design:paramtypes", [upload_service_1.UploadService,
        file_service_1.FileService])
], UploadController);
exports.UploadController = UploadController;
