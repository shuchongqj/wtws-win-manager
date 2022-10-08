import request, { method } from "@/utils/request"
import _ from "lodash"
import { DEFAULT_USER_TYPE } from "@/config"

const api = {
  Add: "user/add",
  Del: "user/",
  Edit: "",
  updateUser: "user/",
  UpdateUserLoginName: "user/login-name",
  UpdateUserRoleAndArea: "user/role",
  getStationList: "station/user/list",
  Get: "user/list",
  Reset: "user/reset-pwd"
}

/**
 * @param {*} parameter
 */
export function reset(id) {
  return request({
    url: api.Reset,
    method: "post",
    data: { userID: id }
  })
}

/**
 * getrole func
 * @param parameter
 * @returns {*}
 */
// export function getStationList(parameter) {
//     return request({
//         url: api.getStationList,
//         method: "get",
//         data: parameter
//     })
// }

/**
 * @param parameter
 * "userID": "",
 "loginName": ""
 * @returns {*}
 */
export function updateuserloginname(parameter) {
  return request({
    url: api.UpdateUserLoginName,
    method: "put",
    data: parameter
  })
}

/**
 * @param parameter
 * "userID": "",
 "workNo": "",
 "displayName": ""
 * @returns {*}
 */
export function updateuser(parameter) {
  return request({
    url: api.updateUser,
    method: "put",
    data: parameter
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function updateuserorleandarea(parameter) {
  return request({
    url: api.UpdateUserRoleAndArea,
    method: "put",
    data: parameter
  })
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  parameter["userRoleInfoList"] = [{ roleID: parameter.roleID }]
  parameter["stations"] = _.map(parameter.station, it => {
    let itemArr = it.split("@")
    return {
      stationID: parseInt(itemArr[0]),
      stationName: itemArr[1]
    }
  })

  // console.log(`parameter.birthDate : ${JSON.stringify(parameter.birthDate)}`)
  // if (parameter.birthDate) {
  //     parameter.birthDate = parameter.birthDate.getFullYear() + "-" + (parameter.birthDate.getMonth() + 1) + "-" + parameter.birthDate.getDate();
  // }

  return method(
    process.env.VUE_APP_API_URL,
    false
  )({
    url: api.Add,
    method: "post",
    data: {
      workNo: parameter.workNo,
      displayName: parameter.displayName,
      loginName: parameter.loginName,
      phoneTel: parameter.phoneTel,
      tel: parameter.tel,
      birthDate: parameter.birthDate,
      gender: parseInt(parameter.gender),
      jobTitle: parameter.jobTitle,
      email: parameter.email,
      roleID: parameter.roleID,
      // stations: parameter.stations,
      user_type: DEFAULT_USER_TYPE
    }
  })
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return method(
    process.env.VUE_APP_API_URL,
    false
  )({
    url: api.Del,
    method: "delete",
    data: { userIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  parameter["userRoleInfoList"] = [{ roleID: parameter.roleID }]
  parameter["userStationInfoList"] = _.map(parameter.station, it => {
    let itemArr = it.split("@")
    return {
      stationID: itemArr[0],
      stationName: itemArr[1]
    }
  })

  return request({
    url: api.Edit,
    method: "post",
    data: parameter
  })
}

export default {
  api,
  // getStationList,
  add,
  del,
  edit,
  updateuserloginname,
  updateuser,
  updateuserorleandarea,
  reset
}
