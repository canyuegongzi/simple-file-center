import {Injectable, NestMiddleware} from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(field: string, count?: number): (req, res, next) => void {
        const upload = multer({ dest: 'uploads/' });
        return count ? upload.array(field, count) : upload.single(field);
    }
}
