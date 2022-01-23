
import {computed, ref, Ref} from "vue";
import {Stopwatch} from "ts-stopwatch";
import {useFirebase} from "./use-firebase";
import {renderMillis} from "./use-render";
import {Callback} from "../types/types";

export const useTimers = () => {

    let timers = [new Stopwatch(), new Stopwatch()]
    const rawTimes = [ref(0), ref(0)]
    setInterval(() => {
        rawTimes[0].value = timers[0].getTime()
        rawTimes[1].value = timers[1].getTime()
    }, 10)
    const renderedTimes = rawTimes.map(timeRef => computed(()=> renderMillis(timeRef.value)))

    const running: Ref<number|undefined> = ref(undefined)
    const {
        makeCall,
        makeAnswer,
        isConnected,
        send,
        setHandler
    } = useFirebase()

    const start = (timerId: number) => {
        if (!timerId || timerId > 1) {
            console.warn(`Invalid timerId: ${timerId}`)
        } // todo extract invalid timerid exception
        const timer = timers[timerId]
        timer.start()
        running.value = timerId
        send(`start:${timerId}`)
    }

    const startHandler: Callback = ['start', (args: string[]) => {
        const playerId = parseInt(args[0])
        timers[playerId].start()
        running.value = playerId
    }]

    const stop = () => {
        if (running.value === undefined) {
            console.warn('Already stopped')
            return
        }
        const runningTimer = timers[running.value]
        runningTimer.stop()
        running.value = undefined
        send(`stop`)
    }

    const stopHandler: Callback = ['stop', (args: string[]) => {
        if (running.value === undefined) {
            console.warn('Already stopped')
            return
        }
        const runningTimer = timers[running.value]
        runningTimer.stop()
        running.value = undefined
    }]

    const play = () => {
        if (running.value === undefined) {
            console.warn(`Not running`)
            return
        }
        const runningTimer = timers[running.value]
        const otherId = running.value === 0 ? 1 : 0
        const other = timers[otherId]
        runningTimer.stop()
        other.start()
        running.value = otherId
        send(`play`)
    }

    const playHandler: Callback = ['play', (args: string[]) => {
        if (running.value === undefined) {
            console.warn(`Not running`)
            return
        }
        const runningTimer = timers[running.value]
        const otherId = running.value === 0 ? 1 : 0
        const other = timers[otherId]
        runningTimer.stop()
        other.start()
        running.value = otherId
    }]

    const reset = () => {
        timers.forEach(timer => timer.reset())
        running.value = undefined
        send('reset')
    }
    const resetHandler: Callback = ['reset', (args: string[]) => {
        timers.forEach(timer => timer.reset())
        running.value = undefined
    }] // todo reformat the rest to be like this

    setHandler([startHandler, stopHandler, playHandler, resetHandler])

    return {
        makeCall,
        makeAnswer,
        isConnected,
        renderedTimes,
        start,
        stop,
        play,
        reset
    }
}