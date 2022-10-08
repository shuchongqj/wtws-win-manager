/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-07 13:27:45
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-30 16:17:41
 */
import Vue from "vue"
import VueRouter from "vue-router"
import Layout from "@/layout/index"

const importFile = file => require(`@/views/${file}.vue`).default

// const RouteView = {
//   name: "RouteView",
//   render: h => h("router-view")
// }

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

export const constantRouterMap = [
  {
    path: "/404",
    name: "404",
    hidden: true,
    component: Layout,
    children: [
      {
        path: "",
        name: "404",
        component: importFile("exception/404")
      }
    ]
  },
  {
    path: "/nopass",
    name: "NoPass",
    hidden: true,
    component: Layout,
    children: [
      {
        path: "",
        name: "NoPass",
        component: importFile("exception/nopass")
      }
    ]
  },
  {
    path: "/",
    redirect: "/dashboard/work",
    hidden: true
  },
  // {
  //   path: "/demo",
  //   name: "Demo",
  //   icon: "appstore",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "",
  //       component: importFile("demo/index"),
  //       name: "Demo",
  //       meta: { title: "Demo", icon: "index", affix: true, noCache: true }
  //     }
  //   ]
  // },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: importFile("login")
  },
  {
    path: "/reset",
    name: "Reset",
    hidden: true,
    component: importFile("resetpwd")
  }
]

const router = new VueRouter({
  mode: "hash",
  base: process.env.VUE_APP_API_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export default router
