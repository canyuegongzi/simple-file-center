import { Connection, SelectQueryBuilder } from "../..";
/**
 * View options.
 */
export interface ViewOptions {
    /**
     * View name.
     */
    name: string;
    /**
     * View expression.
     */
    expression: string | ((connection: Connection) => SelectQueryBuilder<any>);
}
