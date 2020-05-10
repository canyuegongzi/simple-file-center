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
const api_exception_1 = require("../exceptions/api.exception");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let ApiParamsValidationPipe = class ApiParamsValidationPipe {
    transform(value, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const { metatype } = metadata;
            if (!metatype || !this.toValidate(metatype)) {
                return value;
            }
            const object = class_transformer_1.plainToClass(metatype, value);
            const errors = yield class_validator_1.validate(object);
            if (errors.length > 0) {
                const error = errors.shift();
                const constraints = error.constraints;
                const contexts = error.contexts;
                for (const key of Object.keys(constraints)) {
                    throw new api_exception_1.ApiException(constraints[key], contexts[key].errorCode, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            return value;
        });
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
};
ApiParamsValidationPipe = __decorate([
    common_1.Injectable()
], ApiParamsValidationPipe);
exports.ApiParamsValidationPipe = ApiParamsValidationPipe;
