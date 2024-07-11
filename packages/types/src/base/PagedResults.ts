
export interface PagedResults<T> {
    items: T[]
    /// Set this to undefined to tell the app that there are no more items
    metadata?: any
}

export const EndOfPageResults: PagedResults<any> = Object.freeze({
    items: [],
    metadata: undefined
})
