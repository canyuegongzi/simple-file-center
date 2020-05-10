"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_json_1 = require("./config/config.json");
const category_module_1 = require("./module/category.module");
const file_module_1 = require("./module/file.module");
const upload_module_1 = require("./module/upload.module");
const qiniu_module_1 = require("./module/qiniu.module");
const path_1 = require("path");
let MainModule = class MainModule {
};
MainModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: config_json_1.mysqlConfig.host,
                port: 3306,
                username: config_json_1.mysqlConfig.userName,
                password: config_json_1.mysqlConfig.password,
                database: 'b_simple_file_center',
                entities: [path_1.join(__dirname, '**/**.entity{.ts,.js}')],
                synchronize: true,
            }),
            category_module_1.CategoryModule, file_module_1.FileModule, upload_module_1.UploadModule, qiniu_module_1.QiniuModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], MainModule);
exports.MainModule = MainModule;
