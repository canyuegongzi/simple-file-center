"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("../model/entity/category.entity");
const file_entity_1 = require("../model/entity/file.entity");
const file_controller_1 = require("../controller/file.controller");
const file_service_1 = require("../service/service/file.service");
let FileModule = class FileModule {
};
FileModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([category_entity_1.Category, file_entity_1.File]),
        ],
        controllers: [file_controller_1.FileController],
        providers: [file_service_1.FileService],
        exports: [],
    })
], FileModule);
exports.FileModule = FileModule;
