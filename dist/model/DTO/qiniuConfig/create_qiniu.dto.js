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
const class_validator_1 = require("class-validator");
const api_error_code_enum_1 = require("../../../config/api-error-code.enum");
class CreateQiniuDto {
}
__decorate([
    class_validator_1.IsNotEmpty({ message: '名称不能为空', context: { errorCode: api_error_code_enum_1.ApiErrorCode.USER_NAME_STRING } }),
    __metadata("design:type", String)
], CreateQiniuDto.prototype, "accessKey", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'secretKey不能为空', context: { errorCode: api_error_code_enum_1.ApiErrorCode.USER_NAME_STRING } }),
    __metadata("design:type", String)
], CreateQiniuDto.prototype, "secretKey", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'bucket不能为空', context: { errorCode: api_error_code_enum_1.ApiErrorCode.USER_NAME_STRING } }),
    __metadata("design:type", String)
], CreateQiniuDto.prototype, "bucket", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'scope不能为空', context: { errorCode: api_error_code_enum_1.ApiErrorCode.USER_NAME_STRING } }),
    __metadata("design:type", String)
], CreateQiniuDto.prototype, "scope", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'expires不能为空', context: { errorCode: api_error_code_enum_1.ApiErrorCode.USER_NAME_STRING } }),
    __metadata("design:type", Number)
], CreateQiniuDto.prototype, "expires", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'persistentNotifyUrl不能为空', context: { errorCode: api_error_code_enum_1.ApiErrorCode.USER_NAME_STRING } }),
    __metadata("design:type", String)
], CreateQiniuDto.prototype, "persistentNotifyUrl", void 0);
exports.CreateQiniuDto = CreateQiniuDto;
