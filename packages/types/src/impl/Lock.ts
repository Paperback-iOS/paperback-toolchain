/* eslint-disable @typescript-eslint/no-dynamic-delete */
const promises: Record<string, Promise<void> | undefined> = {},
  resolvers: Record<string, (() => void) | undefined> = {}
// uid should be unique per code you protect, e.g. the method signature
export const lock = async (uid: string) => {
  if (promises[uid]) {
    // check if lock exists
    await promises[uid] // wait on lock promise
    await lock(uid) // stack lock check after promise resolves
    return // prev methods do nothing
  }
  // there is no lock, so we'll "acquire" it here
  promises[uid] = new Promise(
    (resolve) =>
      (resolvers[uid] = () => {
        delete promises[uid] // release
        resolve() // resolve
      })
  )
}
export const unlock = (uid: string) => {
  if (resolvers[uid]) {
    resolvers[uid]!()
  }
}
