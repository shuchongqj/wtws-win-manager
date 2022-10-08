/*
 * @Description: 服务车
 * @Author: yuyongjie
 * @Date: 2020-12-26 17:51:20
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-29 22:21:53
 */
import { method } from "@/utils/request"

const api = {
  Get: "driver/list",
  Add: "driver",
  Del: "driver",
  Edit: "driver"
}

let url = process.env.VUE_APP_API_URL

/**
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  return method(url)({
    url: api.Add,
    method: "post",
    data: {
      ...parameter,
      limitTotalLoad: parseFloat(parameter.limitTotalLoad)
    }
  })
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return method(url)({
    url: api.Del,
    method: "delete",
    data: { driverIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  return method(url)({
    url: api.Edit,
    method: "put",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function get(parameter) {
  return method(url)({
    url: api.Get,
    method: "post",
    data: parameter
  })
}

export default {
  get,
  add,
  del,
  edit
}
