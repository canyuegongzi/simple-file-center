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
const transform_interceptor_1 = require("../common/shared/interceptors/transform.interceptor");
const logging_interceptor_1 = require("../common/shared/interceptors/logging.interceptor");
const create_category_dto_1 = require("../model/DTO/category/create_category.dto");
const update_category_dto_1 = require("../model/DTO/category/update_category.dto");
const query_category_dto_1 = require("../model/DTO/category/query_category.dto");
const category_service_1 = require("../service/service/category.service");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    creatCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res1 = yield this.categoryService.findOneByName(params.code);
                if (res1) {
                    return { code: 200, message: '分类已经存在', success: false };
                }
                yield this.categoryService.creatCategory(params);
                return { code: 200, message: '操作成功', success: true };
            }
            catch (e) {
                return { code: 200, message: e.errorMessage, success: false };
            }
        });
    }
    updateCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.categoryService.updateCategory(params);
                return { code: 200, message: '操作成功', success: true };
            }
            catch (e) {
                return { code: 200, message: e.errorMessage, success: false };
            }
        });
    }
    deleteCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.categoryService.deleteCategory(params.id);
                return { code: 200, message: '操作成功', success: true };
            }
            catch (e) {
                return { code: 200, message: e.errorMessage, success: false };
            }
        });
    }
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.categoryService.getList(params);
                const getParentName = (parentId, id) => {
                    let str = '';
                    const arr = [];
                    res.data.map((item) => {
                        if (item.id === parentId) {
                            str = item.name;
                        }
                        if (item.parentId === id) {
                            arr.push(item);
                        }
                    });
                    return { parentName: str, children: arr };
                };
                res.data.forEach((item) => {
                    item.parentName = getParentName(item.parentId, item.id).parentName;
                    item.num = getParentName(item.parentId, item.id).children.length;
                });
                return { code: 200, data: res, message: '查询成功' };
            }
            catch (e) {
                return { code: 200, data: null, message: e.errorMessage };
            }
        });
    }
    getTree() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.categoryService.getCategoryTree();
                return { code: 200, data: res, message: '查询成功' };
            }
            catch (e) {
                return { code: 200, data: null, message: e.errorMessage };
            }
        });
    }
    getInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.categoryService.getInfoCateGory(id);
                return { code: 200, data: res, message: '查询成功', success: true };
            }
            catch (e) {
                return { code: 200, data: null, message: e.errorMessage, success: false };
            }
        });
    }
    getFileListByCate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.categoryService.getFileListByCate(params);
                return { code: 200, data: res, message: '查询成功' };
            }
            catch (e) {
                return { code: 200, data: null, message: e.errorMessage };
            }
        });
    }
};
__decorate([
    common_1.Post('add'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "creatCategory", null);
__decorate([
    common_1.Post('update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
__decorate([
    common_1.Post('delete'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
__decorate([
    common_1.Get('list'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_category_dto_1.QueryCategoryDtoDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getList", null);
__decorate([
    common_1.Get('categoryTree'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getTree", null);
__decorate([
    common_1.Get('info'),
    __param(0, common_1.Query('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getInfo", null);
__decorate([
    common_1.Get('cateFile'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_category_dto_1.QueryCategoryDtoDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getFileListByCate", null);
CategoryController = __decorate([
    common_1.Controller('category'),
    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),
    __param(0, common_1.Inject(category_service_1.CategoryService)),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
