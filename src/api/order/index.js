/*
 * @Description: 服务车
 * @Author: yuyongjie
 * @Date: 2020-12-26 17:51:20
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-29 22:21:53
 */
import { method } from "@/utils/request"

const api = {
  Get: "order/list",
  Add: "order",
  Del: "order",
  Edit: "order",
  GetOrderInfo: "order/info",
  getStationList: "station/getStationList",
  downLoadAll: "order/down-all",
  checkOrder: "order/check",
  invalidOrder: "order/invalid",
  GetAllCheckedOrder: "order/checked"
}

let url = process.env.VUE_APP_API_URL

/**
 * @param parameter
 * @returns {*}
 */
export function getStationList(parameter) {
  return method(url)({
    url: api.getStationList,
    method: "post",
    data: parameter
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  const reqBody = {
    originID: parameter.originID || 0,
    receiveID: parameter.receiveID || 0,
    orderType: parameter.orderType,
    goods: parameter.selectGoods.map(item => ({
      goodID: item.goodsID,
      goodsName: item.goodsName,
      goodsNo: item.goodsNo,
      goodsSpecification: item.goodsSpecification,
      goodsNum: Number(item.goodsNum || 0),
      goodsWeight: Number(item.goodsWeight || 0),
      goodsExtraWeight: Number(item.extraWeight || 0),
      goodsNote: item.goodsNote || ""
    }))
  }
  return method(url)({
    url: api.Add,
    method: "post",
    data: reqBody
  })
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return method(url)({
    url: api.Del,
    method: "delete",
    data: { orderIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  console.log(`parameter  :  ${JSON.stringify(parameter)}`)
  return method(url)({
    url: api.Edit,
    method: "put",
    data: {
      orderType: parameter.orderType,
      receiveID: parameter.receiveID,
      receiveName: parameter.receiveName,
      originID: parameter.originID,
      originName: parameter.originName,
      goodsID: parameter.goodsID,
      goodsNum: Number(parameter.goodsNum),
      goodsWeight: Number(parameter.goodsWeight),
      goodsNote: parameter.goodsNote,
      orderNo: parameter.orderNo,
      orderID: parameter.orderID,
      goodsName: parameter.goodsName
    }
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
export function getOrderInfo(parameter) {
  return method(url)({
    url: api.GetOrderInfo,
    method: "get",
    data: { orderID: parameter.orderID }
  })
}

export function getAllCheckedOrder() {
  return method(url)({
    url: api.GetAllCheckedOrder,
    method: "get"
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function downLoadAll() {
  return method(
    url,
    true,
    "file"
  )({
    url: api.downLoadAll,
    method: "get",
    responseType: "blob"
  })
}

export function checkOrder(parameter) {
  return method(url)({
    url: api.checkOrder,
    method: "post",
    data: {
      orderID: parameter.orderID,
      checkType: parameter.checkType,
      checkNote: parameter.checkNote
    }
  })
}

export function invalidOrder(parameter) {
  return method(url)({
    url: api.invalidOrder,
    method: "post",
    data: {
      orderID: parameter.orderID
    }
  })
}

export default {
  getStationList,
  get,
  add,
  del,
  edit,
  downLoadAll,
  checkOrder,
  getAllCheckedOrder,
  getOrderInfo
}
