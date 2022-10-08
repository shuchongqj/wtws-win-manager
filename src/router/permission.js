import router from "./index"
import NProgress from "nprogress" // progress bar
import { getToken } from "@/utils/auth" // getToken from cookie
import "@/assets/css/NProgress/nprogress.css" // progress bar custom style
// message
// import { notification } from "ant-design-vue"
import { domTitle, setDocumentTitle } from "@/utils/domUtil"
import { getrole } from "@/api/system/menu"
import store from "@/store"
import { filterAsyncRouter } from "@/store/modules/permission"

NProgress.configure({
  showSpinner: true
})

export const whiteList = ["Login"] // token白名单
const nopassPath = ["/login"] // 登陆后不能进入的页面
const defaultRoutePath = "/"

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  to.meta &&
    typeof to.meta.title !== "undefined" &&
    setDocumentTitle(`${domTitle}`)

  /* has token */
  console.log(getToken())
  if (getToken()) {
    if (nopassPath.includes(to.path)) {
      next({
        path: defaultRoutePath
      })
      NProgress.done()
    } else {
      if (to.name === "NoPass") {
        next()
        return
      }

      if (JSON.stringify(store.getters.user) === "{}" || !store.getters.user) {
        if (to.name === "Reset") {
          next()
          return
        }
        // 请求用户信息
        store
          .dispatch("GetInfo", {})
          .then(() => {
            // 动态路由，拉取菜单
            store.dispatch("updateLoadMenus")
            loadMenus(next, to)
          })
          .catch(() => {
            setTimeout(() => {
              store.dispatch("LogOut", false)
            }, 2000)
          })
      } else if (!store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch("updateLoadMenus")
        loadMenus(next, to)
      } else {
        // 如果首次登录 则必须修改密码
        if (store.getters.isfirstlogin && to.name !== "Reset") {
          next(`/reset?account=${store.getters.user.loginName}`)
          return
        }
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // message.error("请先登录系统")
      // console.log(to)
      if (to.path === "/reset") {
        next(`/login`)
      }
      setTimeout(() => {
        // 重定向到首页
        if (to.name === "NoPass") {
          next(`/login`)
          NProgress.done()
        } else {
          next(`/login?redirect=${to.fullPath}`)
          NProgress.done()
        }
      }, 400)
    }
  }
})

// eslint-disable-next-line no-unused-vars
export const loadMenus = (next, to) => {
  getrole({ roleId: store.getters.user.roleID }).then(res => {
    if (res.code === 0) {
      const result = res.result.sort((a, b) => a.index - b.index)

      let asyncRouter = filterAsyncRouter(result).filter(item => item !== false)

      store.dispatch("GenerateRoutes", asyncRouter).then(() => {
        // 存储路由
        asyncRouter.push({ path: "*", redirect: "/404", hidden: true })
        router.addRoutes(asyncRouter) // 动态添加可访问路由表

        // 如果首次登录 则必须修改密码
        if (store.getters.isfirstlogin && to.name !== "Reset") {
          next(`/reset?account=${store.getters.user.loginName}`)
          return
        }
        next({ ...to, replace: true })
      })
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  })
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
