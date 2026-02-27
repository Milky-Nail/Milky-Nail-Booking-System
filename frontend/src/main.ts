import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./rotuer";
import "material-symbols";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

library.add(faFacebook, faInstagram);

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
