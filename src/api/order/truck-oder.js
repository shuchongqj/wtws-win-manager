/*
 * @Description: 服务车
 * @Author: yuyongjie
 * @Date: 2020-12-26 17:51:20
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-29 22:21:53
 */
import { method } from "@/utils/request"

const api = {
  Get: "truck-order/list",
  Add: "truck-order",
  AddSentDirect: "truck-order/sent-direct",
  Del: "truck-order",
  Edit: "truck-order",
  getStationList: "station/getStationList",
  downLoadAll: "truck-order/down-all",
  checkOrder: "truck-order/check",
  invalidOrder: "truck-order/invalid",
  GetAllDrivers: "driver/all",
  GetAllCargoto: "cargoto/all"
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
  if (parameter.orderType !== 3) {
    const reqBody = {
      orderType: parameter.orderType,
      orders: parameter.selectedOrders.map(item => ({
        orderID: item.orderID,
        goodsLoadQuantity: Number(item.goodsLoadQuantity)
      })),
      driverID: parameter.selectedVehicleID,
      isWeightLimit: parameter.isWeightLimit,
      driverTime: parameter.driverTime,
      containerNo: parameter.containerNo,
      cargotoID: parameter.cargotoID,
      paymentMethod: parameter.paymentMethod
    }
    return method(url)({
      url: api.Add,
      method: "post",
      data: reqBody
    })
  } else {
    const reqBody = {
      originID: parameter.originID || 0,
      receiveID: parameter.receiveID || 0,
      goods: parameter.selectGoods.map(item => ({
        goodID: item.goodsID,
        goodsName: item.goodsName,
        goodsNo: item.goodsNo,
        goodsSpecification: item.goodsSpecification,
        goodsNum: Number(item.goodsNum || 0),
        goodsWeight: Number(item.goodsWeight || 0),
        goodsExtraWeight: Number(item.extraWeight || 0),
        goodsNote: item.goodsNote || ""
      })),
      orderType: parameter.orderType,
      driverID: parameter.selectedVehicleID,
      isWeightLimit: parameter.isWeightLimit,
      driverTime: parameter.driverTime,
      containerNo: parameter.containerNo,
      cargotoID: parameter.cargotoID,
      paymentMethod: parameter.paymentMethod
    }
    return method(url)({
      url: api.AddSentDirect,
      method: "post",
      data: reqBody
    })
  }
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return method(url)({
    url: api.Del,
    method: "delete",
    data: { truckOrderIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  return method(url)({
    url: api.Edit,
    method: "put",
    data: {
      receiveID: parameter.receiveID,
      receiveName: parameter.receiveName,
      originID: parameter.originID,
      originName: parameter.originName,
      goodsID: parameter.goodsID,
      goodsNum: Number(parameter.goodsNum),
      goodsWeight: Number(parameter.goodsWeight),
      goodsNote: parameter.goodsNote,
      orderNo: parameter.orderNo,
      truckOrderID: parameter.truckOrderID,
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
      truckOrderID: parameter.truckOrderID,
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
      truckOrderID: parameter.truckOrderID
    }
  })
}

export function getAllCargoto() {
  return method(url)({
    url: api.GetAllCargoto,
    method: "get"
  })
}

export function getAllDrivers() {
  return method(url)({
    url: api.GetAllDrivers,
    method: "get"
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
  getAllDrivers,
  getAllCargoto
}
