/*
 * @Description: 服务车
 * @Author: yuyongjie
 * @Date: 2020-12-26 17:51:20
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-29 22:21:53
 */
import { method } from "@/utils/request"

const api = {
  Get: "goods/list",
  GetAll: "goods/all-list",
  Add: "goods",
  Del: "goods",
  Edit: "goods",
  GetAllCategory: "category/all"
}

let url = process.env.VUE_APP_API_URL

/**
 * @param parameter
 * @returns {*}
 */
// export function getStationList(parameter) {
//   return method(url)({
//     url: api.getStationList,
//     method: "post",
//     data: parameter
//   })
// }

export function getAllCategory() {
  return method(url)({
    url: api.GetAllCategory,
    method: "get"
  })
}

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
      bagWeight: parseFloat(parameter.bagWeight),
      deductWeight: parseFloat(parameter.deductWeight),
      extraWeight: parseFloat(parameter.extraWeight),
      specification: parseFloat(parameter.specification)
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
    data: { goodsIDs: ids }
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

/**
 * @param {*} parameter
 */
export function getAll() {
  return method(url)({
    url: api.GetAll,
    method: "get"
  })
}

/**
 * @param parameter
 * @returns {*}
 */
// export function downLoadAll(params) {
//     return method(
//         url,
//         true,
//         "file"
//     )({
//         url: api.downLoadAll,
//         data: params,
//         method: "post",
//         responseType: "blob"
//     })
// }

export default {
  get,
  getAll,
  add,
  del,
  edit,
  getAllCategory
}
