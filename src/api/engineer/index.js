import { method } from "@/utils/request"

const api = {
  Add: "enterprise/insertEnterprise",
  Edit: "enterprise/updateEnterprise",
  getEnterpriseListByParams: "enterprise/getEnterpriseListByParams",
  getTyreBrandList: "tyre/getTyreTemplateListByParams",
  downLoadAll: "enterprise/getEnterpriseListByParams",
  getDictionaryListByParams: "dictionary/getDictionaryListByParams",
  Del: "enterprise/delEnterprise",
  getFleetListByParams: "fleet/getFleetListByParams",
  insertFleet: "fleet/insertFleet",
  getFleetList: "fleet/getFleetList",
  updateFleet: "fleet/updateFleet",
  deleteFleet: "fleet/deleteFleet",
  getBusinessInfo: "enterprise/getBusinessInfo"
}

let url = process.env.VUE_APP_API_URL

/**
 * @param parameter
 * @returns {*}
 */
export function getTyreBrandList(parameter) {
  return method(
    url,
    false
  )({
    url: api.getTyreBrandList,
    method: "post",
    data: parameter
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function get(parameter, show = true) {
  return method(
    url,
    show
  )({
    url: api.getEnterpriseListByParams,
    method: "post",
    data: { paramsInfo: parameter }
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
    data: { enterpriseInfo: parameter }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  return method(url)({
    url: api.Edit,
    method: "post",
    data: { enterpriseInfo: parameter }
  })
}

/**
 * @param {*} parameter
 */
export function del(parameter) {
  return method(url)({
    url: api.Del,
    method: "post",
    data: { enterpriseID: parameter[0] }
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function downLoadAll(params) {
  console.log(params)
  return method(
    url,
    true,
    "file"
  )({
    url: api.downLoadAll,
    data: { paramsInfo: params },
    method: "post",
    responseType: "blob"
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function getDictionary(parameter) {
  return method(
    url,
    false
  )({
    url: api.getDictionaryListByParams,
    method: "post",
    data: parameter
  })
}

export function getFleetListByParams(parameter) {
  return method(
    url,
    false
  )({
    url: api.getFleetListByParams,
    method: "post",
    data: parameter
  })
}

const insertFleet = parameter => {
  return method(url)({
    url: api.insertFleet,
    method: "post",
    data: parameter
  })
}

const getFleetList = parameter => {
  return method(url)({
    url: api.getFleetList,
    method: "post",
    data: parameter
  })
}

const updateFleet = parameter => {
  return method(url)({
    url: api.updateFleet,
    method: "post",
    data: parameter
  })
}

const deleteFleet = parameter => {
  return method(url)({
    url: api.deleteFleet,
    method: "post",
    data: parameter
  })
}

const getBusinessInfo = parameter => {
  return method(url)({
    url: api.getBusinessInfo,
    method: "post",
    data: parameter
  })
}

export default {
  getTyreBrandList,
  getFleetListByParams,
  add,
  edit,
  del,
  downLoadAll,
  get,
  getDictionary,
  insertFleet,
  getFleetList,
  updateFleet,
  deleteFleet,
  getBusinessInfo
}
