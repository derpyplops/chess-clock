<template>
  <div id="clock">
    <div id="wrapper">
      <span class="time">{{ rendered }}</span>

      <div class="btn-container">
        <a id="start" @click="start">Start</a>
        <a id="stop" @click="stop">Stop</a>
        <a id="reset" @click="reset">Reset</a>
        <a id="makeCall" @click="makeCall">Call</a>
        <a id="answer" @click="makeAnswer">Answer</a>
        <a id="Start Other" @click="startOther">Start Other</a>
        <a id="Stop Other" @click="stopOther">Stop Other</a>
      </div>
      <input v-model="callId"/>
    </div>

    <div class="text">
      <a href="jnhl.dev" target="_blank">@jnhl</a>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { Stopwatch } from "ts-stopwatch";
import { renderMillis } from "./use-render";
import { useFirebase } from "./use-firebase";

const sw = new Stopwatch()
const { makeCall, makeAnswer, callId, startOther, stopOther } = useFirebase(sw)



const time = ref(0)
const rendered = computed(() => renderMillis(time.value))

setInterval(() => time.value = sw.getTime(), 10)

const start = () => sw.start()
const stop = () => sw.stop()
const reset = () => sw.reset()
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");

@font-face {
  font-family: "Share Tech Mono";
  src: url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");
}


#clock, html, body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 1000px;
}

#clock, body {
  background-color: #0a0a0a;
  font-family: "Share Tech Mono", sans-serif;
  display: flex;
  flex-direction: row;
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
#clock .time {
  font-size: 6.5em;
}
#clock .text {
  margin-top: 30px;
  font-size: 1em;
  color: rgba(200, 200, 200, 0.15);
  text-align: center;
}
#clock .text a {
  text-decoration: none;
  color: inherit;
  transition: color 0.1s ease-out;
}
#clock .text a:hover {
  color: #c8c8c8;
}
#clock .btn-container {
  display: flex;
  margin-top: 15px;
}
#clock .btn-container a {
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
#clock .btn-container a:hover {
  color: white;
}
</style>
