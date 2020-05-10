import { NestMiddleware } from '@nestjs/common';
import * as expressSession from 'express-session';
export declare class ExpressSessionMiddleware implements NestMiddleware {
    static configure(opts: expressSession.SessionOptions): void;
    private static options;
    use(req: any, res: any, next: any): void;
}
