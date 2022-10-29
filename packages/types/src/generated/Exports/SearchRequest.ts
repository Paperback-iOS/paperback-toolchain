import { Tag } from "./../_exports";
export interface SearchRequest {
    readonly title?: string;
    readonly includedTags: Tag[];
    readonly excludedTags: Tag[];
    /*
    * internalName: _includeOperator
    */
    readonly includeOperator?: string;
    /*
    * internalName: _excludeOperator
    */
    readonly excludeOperator?: string;
    readonly parameters: Record<string, any>;
}
