import { RawData } from "@paperback/types"
import { PaperbackPolyfills } from "./PaperbackPolyfills"

PaperbackPolyfills.createByteArray = function (rawData: RawData): ByteArray {
	return new Uint8Array(rawData)
}

PaperbackPolyfills.createRawData = function (byteArray): RawData {
	return {
		...byteArray,
		length: byteArray.length,
		toString: function () {
			let out
			let i
			let c
			let char2
			let char3

			const len = this.length
			out = ""
			i = 0
			while (i < len) {
				c = this[i++]
				switch (c >> 4) {
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
						// 0xxxxxxx
						out += String.fromCharCode(c)
						break
					case 12:
					case 13:
						// 110x xxxx   10xx xxxx
						char2 = this[i++]
						out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f))
						break
					case 14:
						// 1110 xxxx  10xx xxxx  10xx xxxx
						char2 = this[i++]
						char3 = this[i++]
						out += String.fromCharCode(
							((c & 0x0f) << 12) |
								((char2 & 0x3f) << 6) |
								((char3 & 0x3f) << 0),
						)
						break
				}
			}

			return out
		},
	}
}
