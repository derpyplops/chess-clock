
import {computed, ref, Ref} from "vue";
import {Stopwatch} from "ts-stopwatch";
import {firebaseConfig, servers} from "./config";
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
    }]

    const stop = (timerId: number) => {
        if (!timerId || timerId > 1) {
            console.warn(`Invalid timerId: ${timerId}`)
        }
        const timer = timers[timerId]
        timer.stop()
        running.value = timerId
        send(`stop:${timerId}`)
    }

    const stopHandler: Callback = ['stop', (args: string[]) => {
        const playerId = parseInt(args[0])
        timers[playerId].stop()
    }]

    const play = () => {
        if (running.value === undefined) {
            console.warn(`Not running`)
            running.value
            return
        }
        const runningTimer = timers[running.value]
        const otherId = running.value === 0 ? 1 : 0
        const other = timers[otherId]
        runningTimer.stop()
        other.start()
        running.value = otherId
        // comm to other client
        // handle comms
    }

    setHandler([startHandler, stopHandler])

    return {
        makeCall,
        makeAnswer,
        renderedTimes,
        start,
        stop,
        play
    }
}