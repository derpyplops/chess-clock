<template>
  <h1>Chess Clock</h1>
  <p>{{rendered}}</p>
  <button @click="start">Start</button>
  <button @click="stop">Stop</button>
  <button @click="reset">Reset</button>

</template>

<script setup lang="ts">
import { ref, defineComponent, computed } from 'vue'

// Thanks to RobG https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript/9763479
const renderMillis = (s: int) =>  {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ':' + mins + ':' + secs + '.' + ms;
}

const rendered = computed(() => renderMillis(0))
  
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
