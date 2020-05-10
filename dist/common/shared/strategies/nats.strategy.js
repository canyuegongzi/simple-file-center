"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const microservices_1 = require("@nestjs/microservices");
class NatsStrategy extends microservices_1.ServerNats {
    bindEvents(client) {
        const patterns = [...this.messageHandlers.keys()];
        const handlers = patterns.map(item => ({
            key: item,
            value: JSON.parse(item),
        }));
        handlers.forEach(({ key, value }) => client.subscribe(value.pattern, { queue: value.queue }, this.getMessageHandler(key, client).bind(this)));
    }
}
exports.NatsStrategy = NatsStrategy;
