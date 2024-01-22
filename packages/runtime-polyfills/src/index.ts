import { PaperbackPolyfills } from "./PaperbackPolyfills"
import './RequestManager'
import './SourceStateManager'

// @ts-ignore
globalThis.Application = new Proxy(PaperbackPolyfills, {
	get(target, p) {
		// @ts-ignore
		if(target[p]) {
			// @ts-ignore
			return target[p]
		}

		if(typeof p === 'string' && p.startsWith('create')) {
			return (anyProps: any) => anyProps
		}

		return undefined
	}
})