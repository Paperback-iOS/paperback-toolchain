
export interface PagedResults<T> {
    items: T[]
    metadata?: any
}

export const EndOfPageResults: PagedResults<any> = Object.freeze({
    items: [],
    metadata: undefined
})
