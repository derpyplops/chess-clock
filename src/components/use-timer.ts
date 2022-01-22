interface Player {
    id: number
    startTime: number
    stoppedTime: number
    lastTimeStopped?: Date
}

const times: Record<number, number> = {}

let players: Player[] = []

const newPlayer = () => {
    return {
        startTime: null,
        stoppedTime: 0
    }
}

const now = () => new Date()

const elapsed = (player: Player) => {
    return now() - player.startTime - player.stoppedTime
}

const switchToPlayer = (player) => {
    const currTime = now()
    startOne(player, currTime)
    const others = players.filter(other => other.id === player.id)
    others.forEach(stopOne(currTime))
}

const stopOne = (currTime: Date) => (player: Player) => {
    player.lastTimeStopped = currTime
}

const startOne = (player: Player, currTime: Date) => {
    return 0
}

const updateTime = (player: Player) => {

}

const driver = () => {
    players.forEach(updateTime)
}
// const started = null

// let timeBegan = [null, null]
// , lastTimeStopped = [null, null]
// , stoppedDuration = [null, null]

// function start(player: int) { // always starts with player 1
//     // if(started) return; // this shouldn't happen if already running
//   if (timeBegan[player] === null) {
//     resetToZero();
//     timeBegan = new Date();
//   }

//   if (lastTimeStopped[player] !== null) {
//     stoppedDuration[player] += (new Date() - lastTimeStopped[player]);
//   }

//   started = setInterval(clockRunning, 10);
// }

// function stop() {
//   lastTimeStopped = new Date();
//   started = clearInterval(started);
// }

// function resetToZero() {
//   clearInterval(started);
//   stoppedDuration = 0;
//   timeBegan = null;
//   lastTimeStopped = null;
//   playerOneTime = 0
// }

// const clockRunning = () => {
//   playerOneTime = new Date() - timeBegan - stoppedDuration
//   playerTwoTime = new Date() - timeBegan - stoppedDuration
// }
