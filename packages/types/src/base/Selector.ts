type KeyOfType<T, V> = keyof {
	[P in keyof T as T[P] extends V ? P : never]: any
}

declare global {
	type SelectorID<K> = string | K

	namespace Paperback {
		class SelectorRegistry {
			static registerSelector<T, K>(
				id: string,
				obj: T,
				key: KeyOfType<T, K>,
			): void

			static unregisterSelector(id: string): void
			static selector<K>(id: SelectorID<K>): K
		}

		function Selector<T, K>(obj: T, symbol: KeyOfType<T, K>): SelectorID<K>
	}
}

export {}
