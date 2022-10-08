/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-31 17:01:01
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-02 15:03:55
 */
import { method } from "@/utils/request"

const Api = {
  Detail: "analysis/detail",
  OrderTypeDetail: "analysis/order-type-detail"
}

let url = process.env.VUE_APP_API_URL

const analysisDetail = parameter => {
  return method(
    url,
    true
  )({
    url: Api.Detail,
    method: "get",
    data: parameter
  })
}

const analysisOrderTypeDetail = parameter => {
  return method(
    url,
    true
  )({
    url: Api.OrderTypeDetail,
    method: "get",
    data: parameter
  })
}

export default {
  analysisDetail,
  analysisOrderTypeDetail
}
