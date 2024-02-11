import { readdirSync } from "node:fs"
import { join, sep } from "node:path"
import type { IEvent } from "../../types/client/event.types"
import type Snaily from "../client"

class EventManager {
    public client: Snaily

    constructor(client: Snaily) {
        this.client = client
    }

    public load(dir: string): void {
        readdirSync(dir).forEach(async (subDir: string): Promise<void> => {
            const events = readdirSync(`${dir}${sep}${subDir}${sep}`)

            for (const file of events) {
                const eventInstance = await import(join(dir, subDir, file))
                const event: IEvent = new eventInstance.default()

                if (event.props.once) {
                    this.client.once(event.props.name, (...args) =>
                        event.execute(this.client, ...args),
                    )
                    return
                }

                this.client.on(event.props.name, (...args) =>
                    event.execute(this.client, ...args),
                )
            }
        })
    }
}

export default EventManager