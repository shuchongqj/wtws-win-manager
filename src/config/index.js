import message from "ant-design-vue/es/message"
import themeColor from "./themeColor.js"

const colorList = [
  {
    key: "薄暮",
    color: "#F5222D"
  },
  {
    key: "火山(默认)",
    color: "#FA541C"
  },
  {
    key: "日暮",
    color: "#FAAD14"
  },
  {
    key: "明青",
    color: "#13C2C2"
  },
  {
    key: "极光绿",
    color: "#52C41A"
  },
  {
    key: "拂晓蓝",
    color: "#1890FF"
  },
  {
    key: "极客蓝",
    color: "#2F54EB"
  },
  {
    key: "酱紫",
    color: "#722ED1"
  }
]

const updateTheme = newPrimaryColor => {
  const hideMessage = message.loading("正在切换主题！", 0)
  themeColor.changeColor(newPrimaryColor).finally(() => {
    setTimeout(() => {
      hideMessage()
    }, 10)
  })
}

const PageSetting = {
  headerHeight: 64, // Header高度
  collapsedWidth: 80, // Slider折叠后宽度
  sliderWidth: 200, // Slider展开后宽度
  primaryColor: "#FA541C", // 默认主题色
  pageStyle: "light", // 页面风格
  NavigationMode: "fixed" // Header、Slider Fixed
}

const defaultPassWord = "123456"

const GET_ROLE_PROMISSION_FUN = Object.freeze({
  ADD: "add",
  LIST: "list"
})

const GET_ROLE_PROMISSION_TYPE = Object.freeze({
  ALL: "all",
  SINGLE: "single"
})

const ADMIN_ROLE_ID = 1
const DRIVER_ROLE_ID = 2
const DEFAULT_USER_TYPE = 1
const DEFAULT_GENDER = 3

const GRENDER_MAP = Object.freeze({
  男: 1,
  女: 2,
  未知: 3
})

const CHECK_TYPE = [
  { key: 1, value: "通过" },
  { key: 2, value: "驳回" }
]

const UNIT_TYPE = Object.freeze({
  1: "内部",
  2: "外部"
})

const UNIT_TYPE_MAP = [
  { key: 0, value: "全部" },
  {
    key: 1,
    value: "内部"
  },
  {
    key: 2,
    value: "外部"
  }
]

const ORDER_TYPE = Object.freeze({
  1: "采购订单",
  2: "销售订单",
  3: "直发/倒短"
})

const TRUCK_ORDER_TYPE = Object.freeze({
  1: "采购订单",
  2: "销售订单",
  3: "直发/倒短"
})

const ORDER_TYPE_MAP = [
  { key: 1, value: "采购订单" },
  { key: 2, value: "销售订单" },
  { key: 3, value: "直发/倒短" }
]

const TRUCK_ORDER_TYPE_MAP = [
  { key: 1, value: "采购订单" },
  { key: 2, value: "销售订单" },
  { key: 3, value: "直发/倒短" }
]

const ORDER_STATUS = Object.freeze({
  1: "等待审核",
  2: "审核通过",
  6: "已派单",
  3: "审核驳回",
  4: "失效",
  5: "结束"
})

const ORDER_STATUS_MAP = [
  { key: 1, value: "等待审核" },
  { key: 2, value: "审核通过" },
  { key: 6, value: "已派单" },
  { key: 3, value: "审核驳回" },
  { key: 4, value: "失效" },
  { key: 5, value: "结束" }
]

const TRUCK_ORDER_STATUS = Object.freeze({
  1: "等待审核",
  2: "审核通过",
  3: "审核驳回",
  4: "失效",
  5: "结束"
})

const TRUCK_ORDER_STATUS_MAP = [
  { key: 1, value: "等待审核" },
  { key: 2, value: "审核通过" },
  { key: 3, value: "审核驳回" },
  { key: 4, value: "失效" },
  { key: 5, value: "结束" }
]

const WEIGH_ORDER_STATUS = Object.freeze({
  // 1: "未完成",
  1: "运输中",
  2: "作废",
  3: "仓库确认",
  4: "等待完成",
  5: "已完成"
})

const WEIGH_ORDER_STATUS_MAP = [
  // { key: 1, value: "未完成" },
  { key: 1, value: "运输中" },
  { key: 2, value: "作废" },
  { key: 3, value: "仓库确认" },
  { key: 4, value: "等待完成" },
  { key: 5, value: "已完成" }
]

const WEIGHT_LIMIT_MAP = [
  {
    key: 1,
    value: "不限重"
  },
  {
    key: 2,
    value: "限重"
  }
]

//1-供方结算 2-客户结算  3-无需结算
const PAYMENT_METHOD_MAP = [
  { key: 1, value: "供方结算" },
  { key: 2, value: "客户结算" },
  { key: 3, value: "无需结算" }
]

export {
  updateTheme,
  colorList,
  PageSetting,
  defaultPassWord,
  GET_ROLE_PROMISSION_FUN,
  GET_ROLE_PROMISSION_TYPE,
  ADMIN_ROLE_ID,
  DEFAULT_USER_TYPE,
  DEFAULT_GENDER,
  GRENDER_MAP,
  UNIT_TYPE,
  UNIT_TYPE_MAP,
  DRIVER_ROLE_ID,
  ORDER_STATUS,
  ORDER_STATUS_MAP,
  ORDER_TYPE,
  ORDER_TYPE_MAP,
  CHECK_TYPE,
  TRUCK_ORDER_TYPE,
  TRUCK_ORDER_TYPE_MAP,
  WEIGHT_LIMIT_MAP,
  PAYMENT_METHOD_MAP,
  WEIGH_ORDER_STATUS,
  WEIGH_ORDER_STATUS_MAP,
  TRUCK_ORDER_STATUS,
  TRUCK_ORDER_STATUS_MAP
}
