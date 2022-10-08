<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="30">
          <a-col :md="4" :sm="24">
            <a-form-item label="过磅单编号">
              <a-input
                v-model="crud.query.weighOrderNo"
                :allowClear="true"
                placeholder="请输入过磅单号"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="派车单号">
              <a-input
                v-model="crud.query.truckOrderNo"
                :allowClear="true"
                placeholder="请输入派车单号"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="订单编号">
              <a-input
                v-model="crud.query.orderNo"
                :allowClear="true"
                placeholder="请输入订单单号"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="车牌号码">
              <a-input
                v-model="crud.query.vehicleNumber"
                :allowClear="true"
                placeholder="请输入车牌号"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="订单类型">
              <a-select
                v-model="crud.query.orderType"
                :allowClear="true"
                :filterOption="filterMapSearch"
                placeholder="请选择类型"
                show-search
              >
                <a-select-option
                  v-for="item in orderTypeMap"
                  :key="item.key"
                  :value="item.key"
                  >{{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="crud.advanced">
            <a-col :md="4" :sm="24">
              <a-form-item label="订单状态">
                <a-select
                  v-model="crud.query.status"
                  :allowClear="true"
                  :filterOption="filterMapSearch"
                  placeholder="请选择订单状态"
                  show-search
                >
                  <a-select-option
                    v-for="item in weighOrderStatusMap"
                    :key="item.key"
                    :value="item.key"
                    >{{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="收货地名称">
                <a-select
                  v-model="crud.query.receiveID"
                  :allowClear="true"
                  :filterOption="filterMapSearch"
                  placeholder="请选择收货地名称"
                  show-search
                >
                  <a-select-option
                    v-for="item in allReceiveMap"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="发货地名称">
                <a-select
                  v-model="crud.query.originID"
                  :allowClear="true"
                  :filterOption="filterMapSearch"
                  placeholder="请选择收货地名称"
                  show-search
                >
                  <a-select-option
                    v-for="item in allOriginMap"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="货品名称">
                <a-input
                  v-model="crud.query.goodsName"
                  :allowClear="true"
                  placeholder="请输入货品名称"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="货品编码">
                <a-input
                  v-model="crud.query.goodsNo"
                  :allowClear="true"
                  placeholder="请输入货品编码"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="创建时间">
                <a-range-picker
                  v-model="crud.query.insertTimes"
                  :allowClear="true"
                  format="YYYY-MM-DD"
                  @change="insertTimeChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="仓库审核时间">
                <a-range-picker
                  v-model="crud.query.warehouseConfirmTime"
                  :allowClear="true"
                  format="YYYY-MM-DD"
                  @change="warehouseTimeChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="财务审核时间">
                <a-range-picker
                  v-model="crud.query.financialConfirmTime"
                  :allowClear="true"
                  format="YYYY-MM-DD"
                  @change="financialTimeChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24"></a-col>
          </template>
          <a-col :md="4" :sm="24">
            <SearchOptions style="width: 100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="过磅单列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          :scroll="{ x: 2000 }"
          rowKey="weighOrderID"
        >
          <template slot="orderType" slot-scope="record">
            <div
              :style="{
                color: record.orderType === 1 ? '#3300FF' : '#33CC33'
              }"
            >
              {{ orderType[record.orderType] }}
            </div>
          </template>

          <template slot="tareTime" slot-scope="record">
            {{ filterInfoTime(record.tareTime) }}
          </template>

          <template slot="roughTime" slot-scope="record">
            {{ filterInfoTime(record.roughTime) }}
          </template>

          <template slot="weightOverTime" slot-scope="record">
            {{ filterInfoTime(record.weightOverTime) }}
          </template>

          <template slot="insertTime" slot-scope="record">
            {{ filterInfoTime(record.insertTime) }}
          </template>

          <template slot="updateTime" slot-scope="record">
            {{ filterInfoTime(record.updateTime) }}
          </template>

          <template slot="status" slot-scope="record">
            <div
              :style="{
                color:
                  record.status === 1
                    ? 'blue'
                    : record.status == 2
                    ? 'red'
                    : record.status == 3
                    ? 'green'
                    : record.status == 4
                    ? 'ff9900'
                    : 'black'
              }"
            >
              {{ weighOrderStatus[record.status] }}
            </div>
          </template>

          <template slot="operation" slot-scope="record">
            <template v-if="record.status === 1 || record.status === 3">
              <a-button type="link" @click="warehouseCheckOrderOk(record)">
                仓库确认
              </a-button>
            </template>

            <template v-if="record.status < 2">
              <a-popconfirm
                cancel-text="取消"
                ok-text="确定"
                title="确定要作废该过磅单吗？"
                @cancel="() => {}"
                @confirm="okInvalid(record)"
              >
                <a href="#">作废</a>
              </a-popconfirm>
            </template>

            <template v-if="record.status === 5">
              <a-button type="link" @click="financialCheckOrderOk(record)">
                财务确认
              </a-button>
            </template>

            <a-button
              :disabled="!$route.meta.code.includes('获取过磅单详情')"
              type="link"
              @click="crud.toInfo(record)"
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
            <a-tab-pane :key="1" tab="过磅单详情">
              <div class="tab1">
                <div>
                  <div class="_l">过磅单号：</div>
                  <div class="_r">
                    <span>
                      {{ form.weighOrderNo }}
                    </span>
                  </div>
                </div>

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
                      {{ form.orderNo }}
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
                  <div class="_l">过磅单状态：</div>
                  <div class="_r">
                    <span>
                      {{ weighOrderStatus[form.status] }}
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
                  <div class="_l">装卸货地点：</div>
                  <div class="_r">
                    <span>
                      {{ form.cargotoName }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">扣除杂重：</div>
                  <div class="_r">
                    <span>
                      {{ filterFloat(form.otherWight) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">毛重：</div>
                  <div class="_r">
                    <span>
                      {{ filterFloat(form.roughWight) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">皮重：</div>
                  <div class="_r">
                    <span>
                      {{ filterFloat(form.tareWight) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">净重：</div>
                  <div class="_r">
                    <span>
                      {{ filterFloat(form.netWight) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">备注：</div>
                  <div class="_r">
                    <span>
                      {{ form.weighOrderNote }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">仓库确认管理员：</div>
                  <div class="_r">
                    <span>
                      {{ form.warehouseName ? form.warehouseName : "-" }}
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
                  <div class="_l">仓库确认时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.warehouseConfirmTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">毛重时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.roughTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">皮重时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.tareTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">净重时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.weightOverTime) }}
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
                  <div class="_l">创建时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterTime(form.insertTime) }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">打印时间：</div>
                  <div class="_r">
                    <span>
                      {{ filterInfoTime(form.printTime) }}
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
                  <div class="_l">货品分类：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsCategoryName }}
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
                  <div class="_l">货品重量：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsWeight }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品重量单位：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsUnit }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">货品生产批号：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsBatchNo }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">允许额外可配发重量：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsExtraWeight }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">每吨扣kg数(吨)：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsDeductWeight }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="_l">编织袋重量：</div>
                  <div class="_r">
                    <span>
                      {{ form.goodsBagWeight }}
                    </span>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-modal>
      </div>

      <!--      仓库审核确认-->
      <a-modal
        v-if="showWareHouseCheck"
        :afterClose="
          () => {
            currentOperateRecord = null
            currentRecordTruckOrders = []
            form.selectedTruckOrderIDs = []
            form.otherWight = 0
          }
        "
        :visible="true"
        title="仓库审核确认过磅单"
        width="50%"
        wrapClassName="stationListDialog"
        @cancel="showWareHouseCheck = false"
        @ok="okWarehouseCheck"
      >
        <a-form-model :rules="rules" labelAlign="left">
          <a-table
            :columns="selectGoodsColumns"
            :dataSource="currentRecordTruckOrders || []"
            :row-selection="{
              selectedRowKeys: form.selectedTruckOrderIDs,
              onChange: changeTruckOrderHandler
            }"
            :scroll="{ x: 1100, y: 250, scrollToFirstRowOnChange: true }"
            rowKey="truckOrderID"
          >
          </a-table>
          <a-form-model-item></a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 6 }"
            label="扣除杂重(吨)"
          >
            <a-input
              v-model="form.otherWight"
              :min="0"
              placeholder="请输入扣除杂重"
              type="number"
            />
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 17 }"
            label="批号"
          >
            <a-input
              v-model="currentOperateRecord.goodsBatchNo"
              placeholder="请输入批号信息"
              type="textarea"
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { form, header, presenter } from "@crud/crud"
import Api, {
  getVehicleTruckOrder,
  invalidOrder,
  warehousecheckOrder
} from "@/api/order/weigh-order"
import { getAll as getAllReceive } from "@/api/station/receive"
import { getAll as getAllOrigin } from "@/api/station/origin"
import { getAll as getAllGoods, getAllCategory } from "@/api/station/goods"
import {
  ORDER_TYPE,
  ORDER_TYPE_MAP,
  UNIT_TYPE_MAP,
  WEIGH_ORDER_STATUS,
  WEIGH_ORDER_STATUS_MAP
} from "@/config"
import { filterMapSearch, fullTimeFilter } from "@/utils/utils"
import { selectTruckOrderGoodsColumns } from "@/views/order/view-columns"

// 表格的填充字段
const defaultForm = {
  orderType: null,
  receiveType: null,
  receiveID: null,
  originType: null,
  originID: null,
  goodCategoryID: null,
  goodsIDs: [],
  selectGoods: [],
  goodsID: null,
  goodsNum: null,
  goodsWeight: null,
  goodsNote: "",
  verifierID: null,

  selectedTruckOrderIDs: [],
  otherWight: 0
}
export default {
  name: "Order",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "过磅单",
      columns: [
        {
          title: "过磅单号",
          dataIndex: "weighOrderNo",
          align: "center",
          width: 160
        },
        {
          title: "关联派车单号",
          dataIndex: "truckOrderNo",
          align: "center",
          width: 220
        },
        {
          title: "关联订单号",
          dataIndex: "orderNo",
          align: "center",
          width: 220
        },
        {
          title: "订单类型",
          width: 110,
          align: "center",
          scopedSlots: { customRender: "orderType" }
        },
        {
          title: "车牌号",
          dataIndex: "vehicleNumber",
          width: 100,
          align: "vehicleNumber"
        },
        {
          title: "发货单位",
          dataIndex: "originName",
          ellipsis: true,
          align: "center",
          width: 220
        },
        {
          title: "收货单位",
          dataIndex: "receiveName",
          ellipsis: true,
          align: "center",
          width: 220
        },
        {
          title: "装卸货地点",
          dataIndex: "cargotoName",
          ellipsis: true,
          align: "center",
          width: 180
        },
        {
          title: "货品名称",
          dataIndex: "goodsName",
          ellipsis: true,
          align: "center",
          width: 200
        },
        {
          title: "货品编码",
          dataIndex: "goodsNo",
          ellipsis: true,
          align: "center",
          width: 170
        },
        {
          title: "货品规格",
          dataIndex: "goodsSpecification",
          align: "center",
          width: 100
        },
        {
          title: "皮重",
          dataIndex: "tareWight",
          align: "center",
          width: 110
        },
        {
          title: "毛重",
          dataIndex: "roughWight",
          align: "center",
          width: 110
        },

        {
          title: "净重",
          dataIndex: "netWight",
          align: "center",
          width: 80
        },

        {
          title: "皮重时间",
          // dataIndex: "tareTime",
          align: "center",
          width: 160,
          scopedSlots: { customRender: "tareTime" }
        },

        {
          title: "毛重时间",
          // dataIndex: "roughTime",
          align: "center",
          width: 160,
          scopedSlots: { customRender: "roughTime" }
        },

        {
          title: "过磅结束时间",
          // dataIndex: "weightOverTime",
          align: "center",
          width: 160,
          scopedSlots: { customRender: "weightOverTime" }
        },

        {
          title: "创建日期",
          width: 160,
          align: "center",
          scopedSlots: { customRender: "insertTime" }
        },
        {
          title: "近期修改日期",
          width: 160,
          align: "center",
          scopedSlots: { customRender: "updateTime" }
        },
        {
          title: "过磅单状态",
          align: "center",
          fixed: "right",
          width: 110,
          scopedSlots: { customRender: "status" }
        },
        {
          title: "操作",
          fixed: "right",
          width: 220,
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...Api },
      idField: "orderID", // 设置每一条记录的唯一标失
      queryFun: (data, crud) => {
        if (
          data.code === 0 &&
          data.result &&
          data.result.list &&
          data.result.list.length &&
          data.result.list.length > 0
        ) {
          crud.data = data.result.list.map(item => {
            item["orderName"] = item.name
            delete item.name
            return item
          })
          crud.page.total = data.result.count
          crud.resetDataStatus()
        }
      }
    })
  },
  filters: {},
  data() {
    return {
      mapVisible: false,
      lng: "",
      lat: "",
      showType: "info",
      unitMap: UNIT_TYPE_MAP,

      weighOrderStatus: WEIGH_ORDER_STATUS,
      weighOrderStatusMap: WEIGH_ORDER_STATUS_MAP,
      orderType: ORDER_TYPE,
      orderTypeMap: ORDER_TYPE_MAP,

      allReceiveMap: [],
      allOriginMap: [],
      allGoodsMap: [],
      allGoodsNameMap: [],
      allGoodsNoMap: [],
      allCategoryMap: [],

      activeKey: 1,

      currentOperateRecord: null,
      currentRecordTruckOrders: [],
      showWareHouseCheck: false,

      selectGoodsColumns: selectTruckOrderGoodsColumns,

      rules: {
        orderType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        receiveID: [
          { required: true, message: "请选择发货地址", trigger: "change" }
        ],
        originID: [
          { required: true, message: "请选择收货地址", trigger: "change" }
        ],
        goodsID: [{ required: true, message: "请选择货品", trigger: "change" }]
      }
    }
  },
  components: { SearchOptions, Operations, Pagination },
  async created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta
    // 关闭下载功能
    // this.crud.optShow.download = true
    this.crud.optShow.edit = false
    // 显示以下按钮
    this.crud.permission = {
      // add: code.includes("新增过磅单"),
      del: code.includes("删除过磅单"),
      edit: code.includes("修改过磅单"),
      download: code.includes("下载过磅单")
    }

    const [
      receiveListRes,
      originListRes,
      goodsListRes,
      getAllCategoryRes
    ] = await Promise.all([
      getAllReceive(),
      getAllOrigin(),
      getAllGoods(),
      getAllCategory()
    ])
    if (receiveListRes.code === 0) {
      this.allReceiveMap = receiveListRes.result.list.map(item => ({
        id: item.receiveID,
        type: item.type,
        name: item.name
      }))
    }

    if (originListRes.code === 0) {
      this.allOriginMap = originListRes.result.list.map(item => ({
        id: item.originID,
        type: item.type,
        name: item.name
      }))
    }

    if (goodsListRes.code === 0) {
      this.allGoodsMap = goodsListRes.result.list
      this.allGoodsNameMap = goodsListRes.result.list.map(item => ({
        id: item.goodsID,
        categoryID: item.categoryID,
        name: item.name
      }))

      this.allGoodsNoMap = goodsListRes.result.list.map(item => ({
        id: item.goodsID,
        name: item.goodsNo
      }))
    }

    if (getAllCategoryRes.code === 0) {
      this.allCategoryMap = getAllCategoryRes.result.list.map(item => ({
        id: item.categoryID,
        name: item.name
      }))
    }
  },
  methods: {
    filterTime: timeStr => fullTimeFilter(timeStr),
    filterMapSearch: filterMapSearch,
    filterInfoTime: function(timeStr) {
      console.log(timeStr)
      const ymdStr = this.filterTime(timeStr).substring(0, 10)
      if (ymdStr === "0001-01-01") {
        return "-"
      }
      return this.filterTime(timeStr)
    },
    filterFloat: floatStr => {
      const floatValue = parseFloat(floatStr)
      return floatValue.toFixed(2)
    },
    insertTimeChange(dates, dateStrings) {
      if (dateStrings[0] && dateStrings[1]) {
        let time1 = dateStrings[0]
        let time2 = dateStrings[1]
        if (
          new Date(time2.replace(/-/g, "/")).getTime() / 1000 -
            (new Date(time1.replace(/-/g, "/")).getTime() / 1000 +
              24 * 60 * 60) >
          365 * 24 * 60 * 60
        ) {
          this.$message.info("请选择一年内的时间！")
          this.crud.query.insertTimes = [time1, time1]
          return
        }
      }
      this.crud.query.insertTimes = dateStrings
    },
    warehouseTimeChange(dates, dateStrings) {
      if (dateStrings[0] && dateStrings[1]) {
        let time1 = dateStrings[0]
        let time2 = dateStrings[1]
        if (
          new Date(time2.replace(/-/g, "/")).getTime() / 1000 -
            (new Date(time1.replace(/-/g, "/")).getTime() / 1000 +
              24 * 60 * 60) >
          365 * 24 * 60 * 60
        ) {
          this.$message.info("请选择一年内的时间！")
          this.crud.query.warehouseConfirmTime = [time1, time1]
          return
        }
      }
      this.crud.query.warehouseConfirmTime = dateStrings
    },
    financialTimeChange(dates, dateStrings) {
      if (dateStrings[0] && dateStrings[1]) {
        let time1 = dateStrings[0]
        let time2 = dateStrings[1]
        if (
          new Date(time2.replace(/-/g, "/")).getTime() / 1000 -
            (new Date(time1.replace(/-/g, "/")).getTime() / 1000 +
              24 * 60 * 60) >
          365 * 24 * 60 * 60
        ) {
          this.$message.info("请选择一年内的时间！")
          this.crud.query.financialConfirmTime = [time1, time1]
          return
        }
      }
      this.crud.query.financialConfirmTime = dateStrings
    },

    async warehouseCheckOrderOk(record) {
      this.currentOperateRecord = { ...record }
      this.currentOperateRecord["goodsBatchNo"] = record.goodsBatchNo || 0
      const truckOrdersRes = await getVehicleTruckOrder({
        vehicleNumber: record.vehicleNumber.trim()
      })
      this.showWareHouseCheck = true
      if (
        truckOrdersRes.code === 0 &&
        truckOrdersRes.result &&
        truckOrdersRes.result.length > 0
      ) {
        this.currentRecordTruckOrders = truckOrdersRes.result
        if (
          truckOrdersRes.result.find(
            item => item.truckOrderID === record.truckOrderID
          )
        ) {
          this.form.selectedTruckOrderIDs = [record.truckOrderID]
        } else {
          this.form.selectedTruckOrderIDs = []
        }
      } else {
        this.currentRecordTruckOrders = []
        this.form.selectedTruckOrderIDs = []
      }
    },

    changeTruckOrderHandler(electedRowKeys) {
      if (electedRowKeys.length > 0) {
        this.form.selectedTruckOrderIDs = [
          electedRowKeys[electedRowKeys.length - 1]
        ]
      }
    },

    financialCheckOrderOk(record) {
      this.currentOperateRecord = record
    },
    async okWarehouseCheck() {
      if (
        !this.form.selectedTruckOrderIDs ||
        this.form.selectedTruckOrderIDs.length === 0
      ) {
        this.$message.error("请选择本次装车的货品")
        return
      }
      const reqData = {
        weighOrderID: this.currentOperateRecord.weighOrderID,
        goodsBatchNo: this.currentOperateRecord.goodsBatchNo,
        otherWight: this.form.otherWight,
        truckOrderID: this.form.selectedTruckOrderIDs[0]
      }
      await warehousecheckOrder({ ...reqData })
      this.showWareHouseCheck = false
      this.crud.refresh()
    },

    okInvalid(record) {
      invalidOrder({ weighOrderID: record.weighOrderID })
      this.crud.refresh()
    },
    callback(key) {
      this.activeKey = key
    }
  }
}
</script>
