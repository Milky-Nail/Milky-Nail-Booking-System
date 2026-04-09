import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "material-symbols";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFacebook,
  faInstagram,
  faGoogle,
  faLine,
} from "@fortawesome/free-brands-svg-icons";
import { createGtm } from "@gtm-support/vue-gtm";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

library.add(faFacebook, faInstagram, faGoogle, faLine);

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(ElementPlus);
app.use(pinia.use(piniaPluginPersistedstate));
app.use(
  createGtm({
    id: "GTM-TVR2XZPZ",
    debug: true,
    vueRouter: router,
  })
);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
