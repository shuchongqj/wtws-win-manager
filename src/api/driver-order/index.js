/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-07 14:09:52
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-03 16:17:25
 */
import { method } from "@/utils/request"

const api = {
  Get: "/driver/truck-order/list"
}

let url = process.env.VUE_APP_API_URL

const get = parameter => {
  return method(url)({
    url: api.Get,
    method: "get",
    data: parameter
  })
}

export default {
  get
}
