import type { IEventBaseProps } from "../../types/client/event.types"

class EventBase {
    public props: IEventBaseProps

    constructor(props: IEventBaseProps) {
        this.props = props
    }
}

export default EventBase