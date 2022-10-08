const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.permission.loadMenus,
  isfirstlogin: state => state.user.isFirstLogin,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  themecolor: state => state.pagesetting.themecolor,
  pagestyle: state => state.pagesetting.pagestyle,
  navigationmode: state => state.pagesetting.navigationmode
}
export default getters
