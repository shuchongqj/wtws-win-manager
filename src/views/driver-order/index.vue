<template>
  <div class="app-container">
    <div class="table-container">
      <Operations tableName="司机派车单列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          :scroll="{ x: 3000 }"
          rowKey="truckOrderID"
        >
          <template slot="orderNo" slot-scope="record">
            {{ record.orderNo ? record.orderNo : "-" }}
          </template>

          <template slot="orderType" slot-scope="record">
            <div
              :style="{
                color:
                  record.orderType === 1
                    ? '#3300FF'
                    : record.orderType === 2
                    ? '#33CC33'
                    : 'red'
              }"
            >
              {{ orderType[record.orderType] }}
            </div>
          </template>

          <template slot="status" slot-scope="record">
            <div
              :style="{
                color:
                  record.status === 1
                    ? 'green'
                    : record.status == 2
                    ? 'blue'
                    : record.status == 3
                    ? '#DDB822'
                    : record.status == 4
                    ? 'red'
                    : 'black'
              }"
            >
              {{ orderStatus[record.status] }}
            </div>
          </template>

          <template slot="isWeightLimit" slot-scope="record">
            {{ record.isWeightLimit === 1 ? "否" : "是" }}
          </template>

          <template slot="limitTotalLoad" slot-scope="record">
            {{ filterFloat(record.limitTotalLoad) }}
          </template>

          <template slot="driverTime" slot-scope="record">
            {{ filterTime(record.driverTime) }}
          </template>

          <template slot="insertTime" slot-scope="record">
            {{ filterTime(record.insertTime) }}
          </template>

          <template slot="updateTime" slot-scope="record">
            {{ filterTime(record.updateTime) }}
          </template>

          <template slot="operation" slot-scope="record">
            <a-button
              :disabled="!$route.meta.code.includes('获取司机派车单详情')"
              type="link"
              @click="toInfoTruckOrder(record)"
            >
              详情
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <!-- 填写表单部分 -->
    <div class="form-container">
      <!--      详情-->
      <div>
        <a-modal
          :title="crud.status.title"
          :visible="crud.status.in > 0 && crud.status.cu === 0"
          :width="1080"
          wrapClassName="truckOrderInfo"
          @cancel="crud.cancelCU()"
          @ok="crud.cancelCU()"
        >
          <a-tabs :activeKey="activeKey" type="card" @change="callback">
            <a-tab-pane :key="1" tab="派货单详情">
              <div class="tab1">
                <div>
                  <div class="_l">派送单号：</div>
                  <div class="_r">
                    <span>
                      {{ form.truckOrderNo }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">关联订单号：</div>
                  <div class="_r">
                    <span>
                      {{ form.truckOrderNo ? form.truckOrderNo : "-" }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">订单类型：</div>
                  <div class="_r">
                    <span>
                      {{ orderType[form.orderType] }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">派送单状态：</div>
                  <div class="_r">
                    <span>
                      {{ orderStatus[form.status] }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">收货单位：</div>
                  <div class="_r">
                    <span>
                      {{ form.receiveName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">发货单位：</div>
                  <div class="_r">
                    <span>
                      {{ form.originName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品名：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品编号：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsNo }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品总重量：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsWeight }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品余量：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsMargin }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">装车量：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsLoadQuantity }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">备注：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsNote }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">派车时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.driverTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">创建人：</div>
                  <div class="_r">
                    <span>
                      {{ form.creatorName ? form.creatorName : "-" }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">审核人：</div>
                  <div class="_r">
                    <span>
                      {{ form.verifierName ? form.verifierName : "-" }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">作废人：</div>
                  <div class="_r">
                    <span>
                      {{ form.invalidName ? form.invalidName : "-" }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">创建时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterTime(form.insertTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">审核时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.verifyTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">作废时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.invalidTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">记录最新变动时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterTime(form.updateTime) }}
                    </span>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="司机车辆详情">
              <div class="tab1">
                <div>
                  <div class="_l">司机姓名：</div>
                  <div class="_r">
                    <span>
                      {{ form.driverName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">司机电话：</div>
                  <div class="_r">
                    <span>
                      {{ form.driverTel }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">车牌号：</div>
                  <div class="_r">
                    <span>
                      {{ form.vehicleNumber }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">最大载重：</div>
                  <div class="_r">
                    <span>
                      {{ form.limitTotalLoad }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">是否限重：</div>
                  <div class="_r">
                    <span>
                      {{ form.isWeightLimit == 1 ? "不限重" : "限重" }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">集装箱/柜号：</div>
                  <div class="_r">
                    <span>
                      {{ form.containerNo }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">装卸货地点：</div>
                  <div class="_r">
                    <span>
                      {{ form.cargotoName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">银行：</div>
                  <div class="_r">
                    <span>
                      {{ form.bankName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">银行卡号：</div>
                  <div class="_r">
                    <span>
                      {{ form.bankNo }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">银行卡姓名：</div>
                  <div class="_r">
                    <span>
                      {{ form.bankUserName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">付款方式：</div>
                  <div class="_r">
                    <span>
                      {{
                        paymentMethodMap[form.paymentMethod]
                          ? paymentMethodMap[form.paymentMethod].value
                          : ""
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane :key="3" tab="货品信息">
              <div class="tab1">
                <div>
                  <div class="_l">货品名称：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品编号：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsNo }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品规格：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsSpecification }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品总件数：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsNum }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品装车量：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsLoadQuantity }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品备注：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsNote }}
                    </span>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { form, header, presenter } from "@crud/crud"
import Api from "@/api/driver-order/index"
import {
  CHECK_TYPE,
  PAYMENT_METHOD_MAP,
  TRUCK_ORDER_STATUS,
  TRUCK_ORDER_STATUS_MAP,
  TRUCK_ORDER_TYPE,
  TRUCK_ORDER_TYPE_MAP,
  WEIGHT_LIMIT_MAP
} from "@/config"
import { fullTimeFilter } from "@/utils/utils"

// 表格的填充字段
const defaultForm = {}

export default {
  name: "Order",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "派车单",
      columns: [
        {
          title: "派车单号",
          dataIndex: "truckOrderNo",
          width: 200,
          align: "center"
        },
        {
          title: "关联订单号",
          // dataIndex: "orderNo",
          width: 200,
          align: "center",
          scopedSlots: { customRender: "orderNo" }
        },
        {
          title: "派车单类型",
          // dataIndex: "status",
          width: 110,
          align: "center",
          scopedSlots: { customRender: "orderType" }
        },

        {
          title: "车牌号",
          dataIndex: "vehicleNumber",
          ellipsis: true,
          align: "center",
          width: 100
        },
        {
          title: "集装箱/柜号",
          dataIndex: "containerNo",
          ellipsis: true,
          align: "center",
          width: 120
        },
        {
          title: "收货单位",
          dataIndex: "receiveName",
          ellipsis: true,
          align: "center",
          width: 220
        },
        {
          title: "发货单位",
          dataIndex: "originName",
          ellipsis: true,
          align: "center",
          width: 220
        },
        {
          title: "装车量(吨)",
          dataIndex: "goodsLoadQuantity",
          ellipsis: true,
          align: "center",
          width: 100
        },
        {
          title: "已运输(吨)",
          dataIndex: "goodsArranged",
          ellipsis: true,
          align: "center",
          width: 100
        },
        {
          title: "单位",
          dataIndex: "goodsUnit",
          ellipsis: true,
          align: "center",
          width: 80
        },
        {
          title: "限重",
          width: 80,
          align: "center",
          scopedSlots: { customRender: "isWeightLimit" }
        },
        {
          title: "限重(吨)",
          width: 80,
          align: "center",
          scopedSlots: { customRender: "limitTotalLoad" }
        },
        {
          title: "运输时间",
          width: 180,
          align: "center",
          scopedSlots: { customRender: "driverTime" }
        },
        {
          title: "创建日期",
          width: 180,
          align: "center",
          scopedSlots: { customRender: "insertTime" }
        },
        {
          title: "近期修改日期",
          width: 280,
          align: "center",
          scopedSlots: { customRender: "updateTime" }
        },
        {
          title: "订单状态",
          // dataIndex: "status",
          fixed: "right",
          align: "center",
          width: 90,
          scopedSlots: { customRender: "status" }
        },
        {
          title: "操作",
          fixed: "right",
          width: 200,
          align: "left",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...Api },
      idField: "truckOrderID" // 设置每一条记录的唯一标失
    })
  },
  filters: {},
  data() {
    return {
      orderStatus: TRUCK_ORDER_STATUS,
      orderStatusMap: TRUCK_ORDER_STATUS_MAP,
      orderType: TRUCK_ORDER_TYPE,
      orderTypeMap: TRUCK_ORDER_TYPE_MAP,
      checkTypeMap: CHECK_TYPE,
      isWeightLimitMap: WEIGHT_LIMIT_MAP,
      paymentMethodMap: PAYMENT_METHOD_MAP,

      activeKey: 1,
      currentOperateRecord: null
    }
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { SearchOptions, Operations, Pagination },
  async created() {
    /**
     * 设置按钮权限
     */
    // let { code } = this.$route.meta
    // 关闭下载功能
    // this.crud.optShow.download = true
    this.crud.optShow.edit = false
    // 显示以下按钮
    this.crud.permission = {
      add: false,
      del: false,
      edit: false,
      download: false
    }
  },

  methods: {
    filterTime: timeStr => fullTimeFilter(timeStr),
    filterInfoTime: function(timeStr) {
      const ymdStr = this.filterTime(timeStr).substring(0, 10)
      if (ymdStr === "0001-01-01") {
        return "-"
      }
      return ymdStr
    },
    filterFloat: floatStr => {
      const floatValue = parseFloat(floatStr)
      return floatValue.toFixed(2)
    },

    async toInfoTruckOrder(record) {
      console.log(`record : ${JSON.stringify(record)}`)
      this.crud.toInfo(record)
    },
    callback(key) {
      console.log(key)
      this.activeKey = key
    }
  }
}
</script>
