import { Request, Response } from "../generated/_exports";
import { PaperbackInterceptor } from "./PaperbackInterceptor";
import { lock, unlock } from "./Lock";

export class BasicRateLimiter extends PaperbackInterceptor {
    private promise?: Promise<void>
    private currentRequestsMade: number = 0
    private lastReset: number = Date.now()

    constructor(id: string, readonly numberOfRequests: number, readonly overSeconds: number) {
        super(id);
    }

    async interceptRequest(request: Request): Promise<Request> {
        await lock(this.id)
        await this.incrementRequestCount()
        unlock(this.id)
        return request
    }

    async interceptResponse(request: Request, response: Response, data: ArrayBuffer): Promise<ArrayBuffer> {
        return data
    }

    async incrementRequestCount() {
        await this.promise

        const secondsSinceLastReset = (Date.now() - this.lastReset)/1000
        if(secondsSinceLastReset > this.overSeconds) {
            this.currentRequestsMade = 0
            this.lastReset = Date.now()
        }

        this.currentRequestsMade += 1

        if(this.currentRequestsMade >= this.numberOfRequests) {
            if (secondsSinceLastReset <= this.overSeconds) {
                const sleepTime = this.overSeconds - secondsSinceLastReset
                console.log(`[BasicRateLimiter] rate limit hit, sleeping for ${sleepTime}`)
                this.promise = Application.sleep(sleepTime)
                await this.promise
            }
        }
    }
}