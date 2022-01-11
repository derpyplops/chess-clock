
const timeBegan = ref(null)
, timeStopped = ref(null)
, stoppedDuration = ref(null)
, started = ref(null)
, running = ref(false)

function start() {
  if(running.value) return;

  if (timeBegan.value === null) {
    reset();
    timeBegan.value = new Date();
  }


  if (timeStopped.value !== null) {
    stoppedDuration.value += (new Date() - timeStopped.value);
  }

  started.value = setInterval(clockRunning, 10);	
  running.value = true;
}

function stop() {
  running.value = false;
  timeStopped.value = new Date();
  clearInterval(started.value);
}

function reset() {
  running.value = false;
  clearInterval(started);
  stoppedDuration.value = 0;
  timeBegan.value = null;
  timeStopped.value = null;
  playerOneTime.value = 0
}

const clockRunning = () => {
  playerOneTime.value = new Date() - timeBegan.value - stoppedDuration.value
}

let playerOneTime = ref(0)