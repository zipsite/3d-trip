import '../css/main.css';
import PanoControll from './panorama/PanoControl';
import ProcessRender from './panorama/ProcessRender.js';
import PanoVue from './panorama/PanoVue'
import { createApp } from 'vue'
import App from './overlay/components/app/App.vue'


let processRender = new ProcessRender();
let panoControl = new PanoControll(processRender.panorama)


const app = createApp(App)
app.use(PanoVue, panoControl)
app.mount('#app')