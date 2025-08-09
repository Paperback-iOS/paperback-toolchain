export type KeyOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

export type SelectorID<K> = string | K

export type SelectorRegistry = {
  registerSelector<T, K>(id: string, obj: T, key: KeyOfType<T, K>): void
  unregisterSelector(id: string): void

  selector<K>(id: SelectorID<K>): K
}
