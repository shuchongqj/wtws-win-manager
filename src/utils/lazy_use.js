/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-07 13:27:45
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-30 16:44:58
 */
import Vue from "vue"

import {
  Autocomplete,
  Button as ElButton,
  Col as ElCol,
  DatePicker as ElDatePicker,
  Image,
  Option as ElOption,
  Row as ElRow,
  Select as ElSelect,
  Slider as ElSlider,
  Tag as ElTag,
  TimePicker as ElTimePicker
} from "element-ui" // antd 框架的input没有搜索  所以需要使用
import "element-ui/lib/theme-chalk/index.css"

import AmapVue from "@amap/amap-vue"
// base library
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  FormModel,
  Icon,
  Input,
  InputNumber,
  Layout,
  Menu,
  message,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  Radio,
  Result,
  Row,
  Select,
  Spin,
  Steps,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Tree,
  Upload
} from "ant-design-vue"

AmapVue.config.version = "2.0" // 默认2.0，这里可以不修改
AmapVue.config.key = "4355b29b5f784a8d82e2d598a2c3a44e"
AmapVue.config.plugins = [
  "AMap.ToolBar",
  "AMap.MoveAnimation"
  // 在此配置你需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
]
Vue.use(AmapVue)

Vue.use(ElDatePicker)
Vue.use(ElTimePicker)
Vue.use(ElRow)
Vue.use(ElCol)
Vue.use(ElButton)
Vue.use(ElSlider)
Vue.use(ElSelect)
Vue.use(ElOption)
Vue.use(ElTag)

Vue.use(Image)
Vue.use(Autocomplete)

// ext library
Vue.use(Card)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Layout)
Vue.use(Pagination)
Vue.use(Drawer)
Vue.use(ConfigProvider)
Vue.use(Breadcrumb)
Vue.use(Result)
Vue.use(Modal)
Vue.use(Checkbox)
Vue.use(Input)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Tabs)
Vue.use(Popover)
Vue.use(Select)
Vue.use(Radio)
Vue.use(Icon)
Vue.use(FormModel)
Vue.use(Dropdown)
Vue.use(Form)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(Spin)
Vue.use(Tree)
Vue.use(Popconfirm)
Vue.use(Divider)
Vue.use(Upload)
Vue.use(Collapse)
Vue.use(Steps)
Vue.use(Empty)

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$error = Modal.error

process.env.NODE_ENV !== "production" &&
  console.warn("[antd-pro] NOTICE: Antd use lazy-load.")
