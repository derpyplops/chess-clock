type Callback = [string, (args: string[]) => void]
type Handler = (event: MessageEvent) => void

export {
    Callback,
    Handler
}