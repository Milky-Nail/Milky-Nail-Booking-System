import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import ServiceAndFee from "../views/ServiceAndFee.vue";
import Gallery from "../views/Gallery.vue";
import Appointment from "../views/Appointment.vue";
import Notice from "../views/Notice.vue";
import About from "../views/About.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/service-and-fee",
    name: "ServiceAndFee",
    component: ServiceAndFee,
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: Gallery,
  },
  {
    path: "/appointment",
    name: "Appointment",
    component: Appointment,
  },
  {
    path: "/notice",
    name: "Notice",
    component: Notice,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: "smooth" };
  },
});

export default router;
