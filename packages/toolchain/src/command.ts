/* eslint-disable no-console */
import { Command } from "@oclif/core"
import Utils from "./utils"

export abstract class CLICommand extends Command {
	override log(message = "") {
		for (const line of message.split("\n")) {
			Utils.log(line)
		}
	}

	time(label: string, format?: string | undefined) {
		return Utils.time(label, format)
	}

	async measure<T>(
		label: string,
		format: string | undefined,
		closure: () => Promise<T>,
	): Promise<T> {
		const time = Utils.time(label, format)
		const result = await closure()
		time.end()
		return result
	}

	measureSync<T>(
		label: string,
		format: string | undefined,
		closure: () => T,
	): T {
		const time = Utils.time(label, format)
		const result = closure()
		time.end()
		return result
	}
}
