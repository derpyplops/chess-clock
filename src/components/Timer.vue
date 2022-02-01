<template>
  <div id="clock">
    <div id="wrapper">
      <div
        v-if="isConnected || devMode"
        class="timers"
      >
        <div class="pair">
          <div class="player">
            Player 1
          </div>
          <div class="time">
            {{ renderedTimes[0].value }}
          </div>
        </div>
        <div class="pair">
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
        <a
          id="start"
          @click="start(0)"
        >Start</a>
        <a
          id="stop"
          @click="stop"
        >Stop</a>
        <a
          id="play"
          @click="play"
        >Switch</a>
        <a
          id="reset"
          @click="reset"
        >Reset</a>
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
  reset
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
</style>
