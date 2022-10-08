import { getInfo, login, logout } from "@/api/user"
import {
  getFirstLogin,
  getToken,
  removeToken,
  setFirstLogin,
  setToken
} from "@/utils/auth"
import { message } from "ant-design-vue"

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    isFirstLogin: getFirstLogin() === "true" ? true : false || false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_FIRST: (state, sign = true) => {
      state.isFirstLogin = sign
      setFirstLogin(sign)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login({ loginName: userInfo.username, password: userInfo.password })
          .then(res => {
            console.log(`login result : ${JSON.stringify(res)}`)
            setToken(res.result.authorization)
            commit("SET_TOKEN", res.result.authorization)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo({})
          .then(res => {
            setUserInfo(res, commit)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    /**
     *
     * @param {*} param0
     * @param {*} sign  true 是默认退出按钮  false 是重置密码不需要验证token
     */
    LogOut({ commit }, sign = true) {
      return new Promise((resolve, reject) => {
        if (sign) {
          logout({})
            .then(res => {
              if (res.code === -16) {
                message.error(res.msg)
              } else {
                message.success(res.msg)
              }
              logOut(commit)
              resolve()
            })
            .catch(err => {
              logOut(commit)
              reject(err)
            })
        } else {
          logOut(commit)
          resolve()
        }
      })
    }
  }
}

export const logOut = commit => {
  commit("SET_TOKEN", "")
  commit("SET_ROLES", [])
  removeToken()
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

export const setUserInfo = (res, commit) => {
  commit("SET_USER", res.result)
}

export default user
