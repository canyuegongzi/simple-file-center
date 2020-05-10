import { AbstractWsAdapter, MessageMappingProperties } from '@nestjs/websockets';
import { Observable } from 'rxjs';
export declare class IoAdapter extends AbstractWsAdapter {
    create(port: number, options?: any & {
        namespace?: string;
        server?: any;
    }): any;
    createIOServer(port: number, options?: any): any;
    bindMessageHandlers(client: any, handlers: MessageMappingProperties[], transform: (data: any) => Observable<any>): void;
    mapPayload(payload: any): {
        data: any;
        ack?: Function;
    };
}
