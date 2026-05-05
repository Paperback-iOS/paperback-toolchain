export type KeyOfType<T, V> = keyof {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in keyof T as T[P] extends V ? P : never]: any
}

export type SelectorID<K> = string | K

export type SelectorRegistry = {
  registerSelector<T, K>(id: string, obj: T, key: KeyOfType<T, K>): void
  unregisterSelector(id: string): void

  selector<K>(id: SelectorID<K>): K
}

export function closureSelector<T extends Function>(
  base: any,
  closureId: string,
  closure: T
): SelectorID<T> {
  base['__closure_selector-' + closureId] = closure
  return Application.Selector(base, '__closure_selector-' + closureId)
}
