"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@nestjs/common/constants");
const lodash_1 = require("lodash");
const swagger_explorer_1 = require("./swagger-explorer");
const swagger_transformer_1 = require("./swagger-transformer");
class SwaggerScanner {
    constructor() {
        this.explorer = new swagger_explorer_1.SwaggerExplorer();
        this.transfomer = new swagger_transformer_1.SwaggerTransformer();
    }
    scanApplication(app, includedModules) {
        const { container } = app;
        const modules = this.getModules(container.getModules(), includedModules);
        const denormalizedPaths = lodash_1.map(modules, ({ routes, metatype }) => {
            const path = metatype
                ? Reflect.getMetadata(constants_1.MODULE_PATH, metatype)
                : undefined;
            return this.scanModuleRoutes(routes, path);
        });
        return Object.assign({}, this.transfomer.normalizePaths(lodash_1.flatten(denormalizedPaths)), { definitions: lodash_1.reduce(this.explorer.getModelsDefinitons(), lodash_1.extend) });
    }
    scanModuleRoutes(routes, modulePath) {
        const denormalizedArray = [...routes.values()].map(ctrl => this.explorer.exploreController(ctrl, modulePath));
        return lodash_1.flatten(denormalizedArray);
    }
    getModules(modulesContainer, include) {
        if (!include || lodash_1.isEmpty(include)) {
            return [...modulesContainer.values()];
        }
        return [...modulesContainer.values()].filter(({ metatype }) => include.some(item => item === metatype));
    }
}
exports.SwaggerScanner = SwaggerScanner;
