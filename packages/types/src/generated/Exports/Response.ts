import { RawData } from "./../_exports";
import { Request } from "./../_exports";
export interface Response {
    readonly data?: string;
    rawData?: RawData;
    readonly status: number;
    readonly headers: Record<any, any>;
    readonly request: Request;
}
