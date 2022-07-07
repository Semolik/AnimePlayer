import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ModuleView from "../views/ModuleView.vue";
import TitleView from "../views/TitleView.vue";
import ErrorStatusCode from "../components/ErrorStatusCode.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/index",
      name: "home",
      component: HomeView,
    },
    {
      path: "/:module",
      name: "module",
      component: ModuleView,
    },
    {
      path: "/:module/title/:title_id",
      component: TitleView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: ErrorStatusCode,
    }
  ],
});

export default router;
