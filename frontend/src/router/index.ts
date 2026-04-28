import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import ServiceAndFee from "../views/ServiceAndFee.vue";
import Gallery from "../views/Gallery.vue";
import Appointment from "../views/Appointment.vue";
import Notice from "../views/Notice.vue";
import About from "../views/About.vue";
import Login from "../views/Login.vue";
import LoginFailed from "../views/LoginFailed.vue";
import Member from "../views/Member.vue";
import OrderRecords from "../views/OrderRecords.vue";
import Management from "../views/Management.vue";
import { useUserStore } from "../stores/user";

const routes = [
  {
    path: "/",
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
    meta: { title: "當月款式" },
  },
  {
    path: "/appointment",
    name: "Appointment",
    component: Appointment,
    meta: { title: "預約美甲" },
  },
  {
    path: "/notice",
    name: "Notice",
    component: Notice,
    meta: { title: "預約須知" },
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: { title: "關於我們" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "登入" },
  },
  {
    path: "/login-failed",
    name: "LoginFailed",
    component: LoginFailed,
  },
  {
    path: "/member",
    name: "Member",
    component: Member,
    meta: { requiresAuth: true, title: "會員中心" },
  },
  {
    path: "/order-records",
    name: "OrderRecords",
    component: OrderRecords,
    meta: { requiresAuth: true, title: "訂單紀錄" },
  },
  {
    path: "/management",
    name: "Management",
    component: Management,
    meta: { requiresAdmin: true, title: "管理中心" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: "smooth" };
  },
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();

  // --- 設定瀏覽器標題邏輯 ---
  const siteName = "MilkyNail";
  const pageTitle = to.meta.title as string;
  document.title = pageTitle ? `${siteName} - ${pageTitle}` : siteName;

  if (
    userStore.isLoggedIn &&
    (to.path === "/login" || to.path === "/register")
  ) {
    return { name: "Home" };
  }
  // 管理者
  if (to.meta.requiresAdmin) {
    if (userStore.isLoggedIn && userStore.userInfo?.role === "admin") {
      return true;
    } else {
      alert("權限不足或請先登入");
      return userStore.isLoggedIn ? { name: "Home" } : { name: "Login" };
    }
    // 會員
  } else if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    alert("請先登入帳號");
    return { name: "Login" };
  } else {
    return true;
  }
});
export default router;
