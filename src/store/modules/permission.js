import { constantRouterMap } from "@/router/index"
import _ from "lodash"

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit("SET_ROUTERS", asyncRouter)
    },
    updateLoadMenus({ commit }) {
      return new Promise(() => {
        commit("SET_LOAD_MENUS", true)
      })
    }
  }
}

export const filterAsyncRouter = (routers, prefix = "") => {
  if (routers) {
    return routers.map(function(item) {
      if (item.functionType === 2 && item.parentFunctionCode === 0) {
        return false
      } else {
        let codes = []
        let children = []
        item.children = item.children === null ? [] : item.children

        for (let i = 0; i < item.children.length; i++) {
          if (item.children[i].functionType === 2) {
            codes.push(item.children[i].functionName)
          } else {
            children.push(item.children[i])
          }
        }

        let route = {
          path: _.trim("/" + (prefix === "" ? "" : `${prefix}/`) + item.path),
          icon: item.functionIcon,
          name: item.functionName,
          functionType: item.functionType,
          meta: {
            code: codes
          }
        }

        if (!isMenu(item.children)) {
          route["children"] = filterAsyncRouter(
            item.children,
            _.trim(item.path)
          )
        }

        route["component"] =
          item.parentFunctionCode === 0
            ? Layout()
            : !isMenu(item.children)
            ? RouterView()
            : loadView((prefix === "" ? "" : `${prefix}/`) + _.trim(item.path))

        if (item.parentFunctionCode === 0 && isMenu(item.children)) {
          route["children"] = [
            {
              path: "",
              name: item.path + "/index",
              component: loadView(
                (prefix === "" ? "" : `${prefix}/`) + _.trim(item.path)
              ),
              meta: {
                code: codes
              }
            }
          ]
        }

        return route
      }
    })
  }
}

/**
 * false说明这个item是目录 true说明这个item是菜单
 * @param {*} routers
 */
const isMenu = routers => {
  return (
    routers.filter(item => {
      return item.functionType === 1
    }).length === 0
  )
}

export const loadView = view => {
  return resolve => require([`@/views/${view}`], resolve)
}

const Layout = () => {
  return resolve => require([`@/layout/index`], resolve)
}

const RouterView = () => {
  return resolve => require([`@/layout/routerview`], resolve)
}

export default permission
