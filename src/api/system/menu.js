import request from "@/utils/request"

const menuApi = {
  GetRoleFunctions: "/role/functions",
  ListRole: "/role/all-list"
}

/**
 * getrole func
 * requirerole_id 填写的话是角色的权限列表 没填写是全部的权限列表
 * @param parameter
 * @returns {*}
 */
export function getrole(data) {
  return request({
    url: menuApi.GetRoleFunctions,
    method: "get",
    data
  })
}

export function listRole() {
  return request({
    url: menuApi.ListRole,
    method: "get"
  })
}

export default {
  getrole,
  listRole
}
