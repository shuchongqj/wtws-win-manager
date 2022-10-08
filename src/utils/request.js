import axios from "axios"
import { message, notification } from "ant-design-vue"
import qs from "qs"
import store from "../store"
import router from "@/router"

// token白名单
let whiteUrl = []

let request = function(
  baseURL,
  toastMessage = true,
  resDataType = "json",
  reqDataType = "json"
) {
  // 创建 axios 实例
  const service = axios.create({
    // API 请求的默认前缀
    baseURL: baseURL,
    timeout: resDataType !== "json" || reqDataType !== "json" ? 1800000 : 20000 // 请求超时时间
  })

  // 异常拦截处理器
  const errorHandler = error => {
    if (error && error.stack.indexOf("timeout") > -1) {
      notification.error({
        message: "失败",
        description: "请求超时"
      })
    }
    if (error && error.stack.indexOf("status code 404") > -1) {
      notification.error({
        message: "失败",
        description: "接口404"
      })
    }
    if (error && error.stack.indexOf("status code 400") > -1) {
      notification.error({
        message: "失败",
        description: "参数404"
      })
    }
    if (error.stack.indexOf("Network Error") > -1) {
      notification.error({
        message: "失败",
        description: "网络错误"
      })
    }
    return Promise.reject(error)
  }

  // request interceptor
  service.interceptors.request.use(config => {
    if (!whiteUrl.includes(config.url)) {
      // 让每个请求携带自定义 token
      const token = store.getters.token
      config.headers["Authorization"] = token
    }

    if (reqDataType === "json") {
      config.headers["Content-Type"] = "application/json;charset=utf-8"
    } else {
      config.headers["Content-Type"] = "multipart/form-data"
    }

    // get请求处理
    if (config.method === "get") {
      if (config.data !== "" && config.data !== {}) {
        config.url += "?" + qs.stringify(config.data)
      }
    }
    return config
  }, errorHandler)

  // response interceptor
  service.interceptors.response.use(response => {
    message.destroy()
    if (resDataType === "json") {
      let code = response.data.code
      if (code >= 0) {
        if (toastMessage) {
          message.success(response.data.message)
        }
        let result = response.data
        if (typeof result === "object" && !Array.isArray(result)) {
          for (const key in result) {
            if (key.includes("list")) {
              let arr = result[key] === null ? [] : result[key]
              for (let i = 0; i < arr.length; i++) {
                const element = arr[i]
                for (const key in element) {
                  // eslint-disable-next-line no-prototype-builtins
                  if (element.hasOwnProperty(key)) {
                    let elementkey = element[key]
                    if (
                      elementkey === "null" ||
                      elementkey === "undefined" ||
                      elementkey === null ||
                      elementkey === undefined ||
                      elementkey === ""
                    ) {
                      element[key] = "-"
                    }
                  }
                }
              }
            }
          }
        }
      } else if (code === -3) {
        message.error(response.data.msg)
        setTimeout(() => {
          store.dispatch("LogOut", false)
        }, 1000)
      } else if (code === -8) {
        router.push("/nopass")
      } else {
        message.error(response.data.message)
      }
    }
    return response.data
  }, errorHandler)

  return service
}

export const method = request

export default request(process.env.VUE_APP_API_URL)
