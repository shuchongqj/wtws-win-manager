import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import _ from "lodash"
import echarts from "echarts"

import "normalize.css/normalize.css"

// 权限指令
import permission from "./directive/Permission"

// 加载mock数据
// import "./mock"
// 路由权限
import "./router/permission"

import "./utils/lazy_use"

Vue.config.productionTip = false

Vue.prototype.$_ = _
Vue.prototype.$echarts = echarts

Vue.use(permission)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
