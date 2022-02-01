<template>
  <div id="clock">
    <div id="wrapper">
      <div
        v-if="isConnected || devMode"
        class="timers"
      >
        <div
          class="pair"
          @click="start(0)"
        >
          <div class="player">
            Player 1
          </div>
          <div class="time">
            {{ renderedTimes[0].value }}
          </div>
        </div>
        <div
          class="pair"
          @click="start(1)"
        >
          <div class="player">
            Player 2
          </div>
          <div class="time">
            {{ renderedTimes[1].value }}
          </div>
        </div>
      </div>
      <div
        v-if="isConnected || devMode"
        class="btn-container"
      >
        <svg
          v-if="running === undefined"
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          @click="start()"
        >
          <path
            d="M20.494,7.968l-9.54-7A5,5,0,0,0,3,5V19a5,5,0,0,0,7.957,4.031l9.54-7a5,5,0,0,0,0-8.064Zm-1.184,6.45-9.54,7A3,3,0,0,1,5,19V5A2.948,2.948,0,0,1,6.641,2.328,3.018,3.018,0,0,1,8.006,2a2.97,2.97,0,0,1,1.764.589l9.54,7a3,3,0,0,1,0,4.836Z"
          /></svg>
        <svg
          v-else
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          @click="play"
        ><path d="M23.421,16.583,20.13,13.292a1,1,0,1,0-1.413,1.414L21.007,17A9.332,9.332,0,0,1,14.321,14.2a.982.982,0,0,0-1.408.08L12.9,14.3a1,1,0,0,0,.075,1.382A11.177,11.177,0,0,0,21.01,19l-2.293,2.293A1,1,0,1,0,20.13,22.7l3.291-3.291A2,2,0,0,0,23.421,16.583Z" /><path d="M21.007,7l-2.29,2.29a.892.892,0,0,0-.054.082.992.992,0,0,0,1.467,1.332L21.836,9l1.586-1.585a2,2,0,0,0,.457-2.1,1.969,1.969,0,0,0-.458-.728L20.13,1.3a1,1,0,1,0-1.413,1.413L21.01,5.005c-4.933.012-7.637,2.674-10.089,5.474C8.669,7.937,6,5.4,1.487,5.046L1.006,5a1,1,0,0,0-1,1,1.02,1.02,0,0,0,1,1c.072,0,.287.033.287.033C5.189,7.328,7.425,9.522,9.6,12c-2.162,2.466-4.383,4.7-8.247,4.96l-.4.021a.994.994,0,1,0,.124,1.985c.156-.007.41-.013.535-.023,5.02-.387,7.743-3.6,10.171-6.409C14.235,9.7,16.551,7.018,21.007,7Z" /></svg>
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          @click="stop"
        ><path d="M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0Zm3,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H19a3,3,0,0,1,3,3Z" /></svg>
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          @click="reset"
        ><path d="M10.42,20.656a3.77,3.77,0,0,1-2.233-.735l-6.641-4.87a3.784,3.784,0,0,1,0-6.1l6.641-4.87A3.783,3.783,0,0,1,14.2,6.853l3.782-2.774A3.784,3.784,0,0,1,24,7.13v9.74a3.784,3.784,0,0,1-6.021,3.051L14.2,17.147a3.79,3.79,0,0,1-3.777,3.509Zm2.787-6.475a1,1,0,0,1,.592.194l5.363,3.933A1.784,1.784,0,0,0,22,16.87V7.13a1.785,1.785,0,0,0-2.839-1.438L13.8,9.625a1,1,0,0,1-1.592-.806V7.13A1.784,1.784,0,0,0,9.369,5.692l-6.64,4.87a1.783,1.783,0,0,0,0,2.876l6.64,4.87a1.784,1.784,0,0,0,2.838-1.438V15.181a1,1,0,0,1,1-1Z" /></svg>
      </div>
      <div
        v-else
        class="btn-container"
      >
        <a
          id="makeCall"
          @click="handleCall"
        >Call</a>
        <!--        <a id="answer" @click="handleAnswer">Answer</a>-->
      </div>
      <input
        v-if="!isConnected"
        v-model="callId"
        readonly
      >
    </div>

    <div class="me">
      <a
        href="https://jnhl.dev"
        target="_blank"
      >@jnhl</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useTimers} from "./use-timers";

const {
  makeCall,
  makeAnswer,
  renderedTimes,
  isConnected,
  start,
  stop,
  play,
  reset,
    running
} = useTimers()

const params = new URLSearchParams(window.location.search)

const callId = ref('')

const callIdFromParams = params.get('call')
if (callIdFromParams) {
  makeAnswer(callIdFromParams)
}


const handleCall = async () => {
  callId.value = `${window.location.href}?call=${await makeCall()}`
}

const devMode = import.meta.env.DEV

</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");

@font-face {
  font-family: "Share Tech Mono";
  src: url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");
}

@media (orientation: landscape) {
  .player {
    font-size: 2em !important;
  }
  .time {
    font-size: 3em !important;
  }
}

#clock, html, body {
  padding: 0;
  margin: 0;
}

#clock, body {
  font-family: "Share Tech Mono", sans-serif;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: center;
}

#clock {
  order: 0;
  flex: 0 1 auto;
  align-self: center;
  color: #c8c8c8;
}
.time {
  font-size: 6.5em;
}
.me {
  margin-top: 30px;
  font-size: 1em;
  color: rgba(200, 200, 200, 0.15);
  text-align: center;
}
.text a {
  text-decoration: none;
  color: inherit;
  transition: color 0.1s ease-out;
}
#clock .text a:hover {
  color: #c8c8c8;
}
.btn-container {
  display: flex;
  margin-top: 15px;
  margin-bottom: 15px;
  justify-content: space-between;
}
.btn-container a {
  text-align: center;
  font-family: "Share Tech Mono", sans-serif;
  background: transparent;
  border: none;
  color: #c8c8c8;
  padding: 10px 15px;
  margin: 0 10px;
  text-transform: uppercase;
  font-size: 2em;
  cursor: pointer;
  flex-grow: 1;
  transition: color 0.1s ease-out;
}
.btn-container a:hover {
  color: white;
}

.pair {
  display: flex;
  justify-content: center;
  align-items: center;
}

.player {
  font-size: 40px;
  margin-right: 30px;
}

.icon {
  filter: invert(96%) sepia(0%) saturate(117%) hue-rotate(186deg) brightness(82%) contrast(94%);
}
</style>
