"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
require("reflect-metadata");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const session = require("express-session");
const http_exception_filter_1 = require("./common/error/filters/http-exception.filter");
const api_params_validation_pipe_1 = require("./common/error/pipe/api-params-validation.pipe");
const config_json_1 = require("./config/config.json");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 1000 * 60 * 3,
            },
        }));
        app.enableCors();
        app.useStaticAssets(path_1.join(__dirname, '.', 'public'), { prefix: '/public/' });
        app.setBaseViewsDir(path_1.join(__dirname, '.', 'views'));
        app.setViewEngine('ejs');
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        app.useGlobalPipes(new api_params_validation_pipe_1.ApiParamsValidationPipe());
        app.setGlobalPrefix(config_json_1.config.globalPrefix);
        yield app.listen(config_json_1.config.port);
    });
}
bootstrap();
