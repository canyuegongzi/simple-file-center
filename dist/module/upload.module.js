"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const category_entity_1 = require("../model/entity/category.entity");
const file_entity_1 = require("../model/entity/file.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const upload_controller_1 = require("../controller/upload.controller");
const upload_service_1 = require("../service/service/upload.service");
const file_1 = require("../utils/file");
const file_service_1 = require("../service/service/file.service");
const path_1 = require("path");
let UploadModule = class UploadModule {
};
UploadModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([category_entity_1.Category, file_entity_1.File]),
            platform_express_1.MulterModule.register({
                storage: multer_1.diskStorage({
                    destination: (req, file, cb) => __awaiter(this, void 0, void 0, function* () {
                        const dirType = file_1.fileType(file);
                        yield file_1.dirExists(`${path_1.join(__dirname, '../public/')}${dirType}`);
                        return cb(null, `${path_1.join(__dirname, '../public/')}${dirType}`);
                    }),
                    filename: (req, file, cb) => {
                        const filename = `${encodeURI(file.originalname, 'GBK').toString('iso8859-1')}`;
                        return cb(null, filename);
                    },
                }),
            }),
        ],
        controllers: [upload_controller_1.UploadController],
        providers: [upload_service_1.UploadService, file_service_1.FileService],
        exports: [],
    })
], UploadModule);
exports.UploadModule = UploadModule;
