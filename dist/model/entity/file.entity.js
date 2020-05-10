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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
let File = class File {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], File.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: false }),
    __metadata("design:type", String)
], File.prototype, "time", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], File.prototype, "url", void 0);
__decorate([
    typeorm_1.ManyToOne(type => category_entity_1.Category, category => category.files),
    __metadata("design:type", category_entity_1.Category)
], File.prototype, "category", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], File.prototype, "isDelete", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], File.prototype, "encoding", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], File.prototype, "size", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], File.prototype, "destination", void 0);
__decorate([
    typeorm_1.Column({ default: 0, comment: '服务器类别' }),
    __metadata("design:type", Number)
], File.prototype, "serverCategory", void 0);
__decorate([
    typeorm_1.Column({ default: null, nullable: true, comment: '用户' }),
    __metadata("design:type", String)
], File.prototype, "userName", void 0);
File = __decorate([
    typeorm_1.Entity()
], File);
exports.File = File;
