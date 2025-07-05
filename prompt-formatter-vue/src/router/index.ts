import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Guide from "../views/Guide.vue";
import FAQ from "../views/FAQ.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/guides", component: Guide },
  { path: "/faq", component: FAQ },
  { path: "/prompt-templates/:id", component: Home },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
