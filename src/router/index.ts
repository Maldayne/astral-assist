import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Home from "../views/Home"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
