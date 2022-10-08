import request from "@/utils/request"

const api = {
  Add: "station",
  Del: "station",
  Edit: "station",
  getStationList: "station/list",
  getUserStationEnterprise: "enterprise/user/list"
}

/**
 * @param parameter
 * @returns {*}
 */
export function getUserStationEnterprise() {
  return request({
    url: api.getUserStationEnterprise,
    method: "get"
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function getStationList(parameter) {
  return request({
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
  console.log(`add parameter : ${JSON.stringify(parameter)}`)
  return request({
    url: api.Add,
    method: "post",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return request({
    url: api.Del,
    method: "delete",
    data: { stationIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  parameter.enterpriseIDs = parameter.enterpriseIDs.filter(
    (item, index, self) => index == self.indexOf(item)
  )

  console.log(
    ` parameter.enterpriseIDs ${JSON.stringify(parameter.enterpriseIDs)}`
  )
  console.log(
    `parameter.enterpriseIDs.filter((item, index, self) => index == self.indexOf(item)) : ${JSON.stringify(
      parameter.enterpriseIDs.filter(
        (item, index, self) => index == self.indexOf(item)
      )
    )}`
  )

  return request({
    url: api.Edit,
    method: "put",
    data: {
      stationID: parameter.stationID,
      stationName: parameter.name,
      stationAddress: parameter.address,
      contactPerson: parameter.contactPerson,
      contactTel: parameter.contactTel,
      longitude: parameter.longitude,
      latitude: parameter.latitude,
      enterpriseIDs: parameter.enterpriseIDs,
      province: parameter.province,
      city: parameter.city,
      area: parameter.area
    }
  })
}

export default {
  getStationList,
  getUserStationEnterprise,
  add,
  del,
  edit
}
