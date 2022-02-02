import { createApp } from 'vue'
import App from './App.vue'
import VueFullscreen from "vue-fullscreen";

const app = createApp(App)

app.use(VueFullscreen)
app.mount('#app')


