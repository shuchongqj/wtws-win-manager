<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="订单编号">
              <a-input
                v-model="crud.query.orderNo"
                :allowClear="true"
                placeholder="订单编号模糊搜索"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
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

          <a-col :md="6" :sm="24">
            <a-form-item label="订单状态">
              <a-select
                v-model="crud.query.orderStatus"
                :allowClear="true"
                :filterOption="filterMapSearch"
                placeholder="请选择订单状态"
                show-search
              >
                <a-select-option
                  v-for="item in orderStatusMap"
                  :key="item.key"
                  :value="item.key"
                  >{{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="crud.advanced">
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

            <a-col :md="6" :sm="24">
              <a-form-item label="货品名称">
                <a-input
                  v-model="crud.query.goodsName"
                  :allowClear="true"
                  placeholder="货品名称模糊查询"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="货品编码">
                <a-input
                  v-model="crud.query.goodsNo"
                  :allowClear="true"
                  placeholder="货品编码模糊查询"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
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
              <a-form-item label="审核时间">
                <a-range-picker
                  v-model="crud.query.verifyTimes"
                  :allowClear="true"
                  format="YYYY-MM-DD"
                  @change="verifyTimeChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24"></a-col>
          </template>
          <a-col :md="6" :sm="24">
            <SearchOptions style="width: 100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="采购/销售单列表" />
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
          rowKey="orderID"
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
                    : record.status == 5
                    ? 'black'
                    : '#8226de'
              }"
            >
              {{ orderStatus[record.status] }}
            </div>
          </template>

          <template slot="insertTime" slot-scope="record">
            {{ filterTime(record.insertTime) }}
          </template>

          <template slot="updateTime" slot-scope="record">
            {{ filterTime(record.updateTime) }}
          </template>

          <template slot="operation" slot-scope="record">
            <template v-if="record.status === 1">
              <a-button type="link" @click="checkOrderOk(record)">
                审核
              </a-button>
            </template>

            <template v-if="record.status < 3">
              <a-popconfirm
                cancel-text="取消"
                ok-text="确定"
                title="确定要作废该订单吗？"
                @cancel="() => {}"
                @confirm="okInvalid(record)"
              >
                <a href="#">作废</a>
              </a-popconfirm>
            </template>

            <a-button
              :disabled="!$route.meta.code.includes('获取订单详情')"
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
      <!--      创建-->
      <a-modal
        :afterClose="() => (currentStep = 0)"
        :title="crud.status.title"
        :visible="crud.status.cu > 0 && crud.status.in === 0"
        :width="1200"
        wrapClassName="stationListDialog"
        @cancel="crud.cancelCU()"
      >
        <a-form-model
          ref="form"
          :class="
            crud.status.in > 0 && crud.status.cu === 0 ? 'disabled-form' : ''
          "
          :label-col="{ span: 3 }"
          :model="form"
          :rules="rules"
          :wrapper-col="{ span: 8 }"
          labelAlign="left"
        >
          <a-steps
            :current="currentStep"
            size="small"
            status="error"
            style="margin-bottom: 25px"
          >
            <a-step title="选择订单类型" />
            <a-step title="选择收货单位" />
            <a-step title="选择发货单位" />
            <a-step title="选择产品" />
            <a-step title="填写货物信息" />
          </a-steps>

          <a-form-model-item label="订单类型:" prop="orderType">
            <a-radio-group
              v-model="form.orderType"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="form.orderType ? (currentStep = 1) : (currentStep = 0)"
            >
              <a-radio
                v-for="item in orderTypeMap.filter(item => item.key !== 3)"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <!--          收货单位-->
          <a-form-model-item
            v-if="currentStep > 0"
            label="收货单位类型"
            prop="receiveType"
          >
            <a-radio-group
              v-model="form.receiveType"
              @change="
                () => {
                  form.receiveID = null
                  currentStep = 1
                }
              "
            >
              <a-radio v-for="item in unitMap" :key="item.key" :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item
            v-if="currentStep > 0"
            label="收货单位名称"
            prop="receiveID"
          >
            <a-select
              v-model="form.receiveID"
              :allowClear="true"
              :filterOption="filterMapSearch"
              placeholder="请选择收货地名称"
              show-search
              @change="form.receiveID ? (currentStep = 2) : (currentStep = 1)"
            >
              <a-select-option
                v-for="item in allReceiveMap.filter(item2 => {
                  if (!form.receiveType) {
                    return true
                  } else {
                    return item2.type === form.receiveType
                  }
                })"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!--          发货单位-->
          <a-form-model-item
            v-if="currentStep > 1"
            label="发货单位类型"
            prop="originType"
          >
            <a-radio-group
              v-model="form.originType"
              @change="
                () => {
                  form.originID = null
                  currentStep = 2
                }
              "
            >
              <a-radio v-for="item in unitMap" :key="item.key" :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item
            v-if="currentStep > 1"
            label="发货单位地址"
            prop="originID"
          >
            <a-select
              v-model="form.originID"
              :allowClear="true"
              :filterOption="filterMapSearch"
              placeholder="请选择发货地址"
              show-search
              @change="form.originID ? (currentStep = 3) : (currentStep = 2)"
            >
              <a-select-option
                v-for="item in allOriginMap.filter(item2 => {
                  if (!form.originType) {
                    return true
                  } else {
                    return item2.type === form.originType
                  }
                })"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!--选择货品-->
          <a-form-model-item
            v-if="currentStep > 2"
            label="货物类型"
            prop="goodCategoryID"
          >
            <a-select
              v-model="form.goodCategoryID"
              :allowClear="true"
              placeholder="请选择货物类型"
              show-search
              @change="
                form.goodsIDs && form.goodsIDs.length > 0
                  ? (currentStep = 4)
                  : (currentStep = 3)
              "
            >
              <a-select-option
                v-for="item in allCategoryMap"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            v-if="currentStep > 2"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            label="货物"
            prop="goodsIDs"
          >
            <a-select
              v-model="form.goodsIDs"
              :allowClear="true"
              :filterOption="filterMapSearch"
              mode="multiple"
              placeholder="请选择货物"
              show-search
              @change="changeGoodsList"
            >
              <a-select-option
                v-for="item in allGoodsNameMap.filter(item2 => {
                  if (!form.goodCategoryID) {
                    return true
                  } else {
                    return item2.categoryID === form.goodCategoryID
                  }
                })"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!--          获取列表-->
          <span v-if="currentStep > 3" label="货物列表"> </span>
        </a-form-model>
        <a-table
          v-if="currentStep > 3"
          :columns="selectGoodsColumns"
          :dataSource="form.selectGoods"
          bordered
          rowKey="goodsID"
        >
          <template slot="goodsWeight" slot-scope="record">
            <a-input
              v-model="record.goodsWeight"
              allowClear
              type="number"
              @change="checkGoodsList"
            />
          </template>

          <template slot="goodsNum" slot-scope="record">
            <a-input
              v-model="record.goodsNum"
              allowClear
              type="number"
              @change="checkGoodsList"
            />
          </template>

          <template slot="goodsNote" slot-scope="record">
            <a-input
              v-model="record.goodsNote"
              allowClear
              @change="checkGoodsList"
            />
          </template>
        </a-table>
        <template slot="footer">
          <div v-if="crud.status.cu > 0">
            <a-button
              v-if="crud.status.add > 0"
              key="back"
              @click="crud.cancelCU()"
            >
              取消
            </a-button>
            <a-button
              v-if="crud.status.edit > 0"
              key="back"
              @click="crud.cancelCU('uptoinfo')"
            >
              取消
            </a-button>
            <a-button
              v-if="crud.status.add > 0"
              key="submit"
              type="primary"
              @click="toAddOrder"
            >
              提交
            </a-button>
            <a-button
              v-if="crud.status.edit > 0"
              key="submit"
              type="primary"
              @click="crud.submitCU()"
            >
              保存
            </a-button>
          </div>
          <div v-if="crud.status.in > 0 && crud.status.cu === 0">
            <a-button
              key="back"
              :disabled="!crud.permission.edit"
              @click="crud.toEdit()"
            >
              修改
            </a-button>
            <a-popconfirm
              cancel-text="取消"
              ok-text="删除"
              placement="topRight"
              @confirm="crud.doDelete(null, 'close')"
            >
              <template slot="title">
                你确定要删除吗？
              </template>
              <a-button
                key="submit"
                :disabled="!crud.permission.del"
                type="danger"
              >
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </template>
      </a-modal>

      <a-modal
        :title="crud.status.title"
        :visible="crud.status.in > 0"
        width="30%"
        wrapClassName="stationListDialog"
        @cancel="crud.cancelCU()"
      >
        <a-form-model
          ref="form"
          :class="
            crud.status.in > 0 && crud.status.cu === 0 ? 'disabled-form' : ''
          "
          :label-col="{ span: 6 }"
          :model="form"
          :rules="rules"
          :wrapper-col="{ span: 12 }"
          labelAlign="left"
        >
          <a-form-model-item label="订单状态">
            <span>{{ orderStatus[form.status] }}</span>
          </a-form-model-item>

          <a-form-model-item label="订单类型:" prop="orderType">
            <a-radio-group
              v-model="form.orderType"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            >
              <a-radio
                v-for="item in orderTypeMap.filter(item => item.key !== 3)"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <!--          收货单位-->
          <a-form-model-item
            v-if="crud.status.in > 0 && crud.status.cu > 0"
            label="收货单位类型"
            prop="receiveType"
          >
            <a-radio-group
              v-model="form.receiveType"
              @change="() => (form.receiveID = null)"
            >
              <a-radio v-for="item in unitMap" :key="item.key" :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="收货单位名称" prop="receiveID">
            <a-select
              v-model="form.receiveID"
              :allowClear="true"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :filterOption="filterMapSearch"
              placeholder="请选择收货地名称"
              show-search
            >
              <a-select-option
                v-for="item in allReceiveMap.filter(item2 => {
                  if (!form.receiveType) {
                    return true
                  } else {
                    return item2.type === form.receiveType
                  }
                })"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!--          发货单位-->
          <a-form-model-item
            v-if="crud.status.in > 0 && crud.status.cu > 0"
            label="发货单位类型"
            prop="originType"
          >
            <a-radio-group
              v-model="form.originType"
              @change="() => (form.originID = null)"
            >
              <a-radio v-for="item in unitMap" :key="item.key" :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="发货单位地址" prop="originID">
            <a-select
              v-model="form.originID"
              :allowClear="true"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :filterOption="filterMapSearch"
              placeholder="请选择发货地址"
              show-search
            >
              <a-select-option
                v-for="item in allOriginMap.filter(item2 => {
                  if (!form.originType) {
                    return true
                  } else {
                    return item2.type === form.originType
                  }
                })"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!--选择货品-->
          <a-form-model-item
            v-if="crud.status.in > 0 && crud.status.cu > 0"
            label="货物类型"
            prop="goodCategoryID"
          >
            <a-select
              v-model="form.goodCategoryID"
              :allowClear="true"
              placeholder="请选择货物类型"
              show-search
            >
              <a-select-option
                v-for="item in allCategoryMap"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="货物" prop="goodsName">
            <a-select
              v-model="form.goodsName"
              :allowClear="true"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :filterOption="filterMapSearch"
              placeholder="请选择货物"
              show-search
            >
              <a-select-option
                v-for="item in allGoodsNameMap.filter(item2 => {
                  if (!form.goodCategoryID) {
                    return true
                  } else {
                    return item2.categoryID === form.goodCategoryID
                  }
                })"
                :key="item.id"
                :value="item.name"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="计划数(吨)" prop="goodsWeight">
            <a-input
              v-model="form.goodsWeight"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="计划数(件)" prop="goodsNum">
            <a-input
              v-model="form.goodsNum"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            label="备注"
            prop="goodsNote"
          >
            <a-input
              v-model="form.goodsNote"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="是否审核">
            <span>{{ form.verifierID ? "是" : "否" }}</span>
          </a-form-model-item>

          <a-form-model-item label="审核备注">
            <span>{{ form.verifierNote }}</span>
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <div v-if="crud.status.cu > 0">
            <a-button
              v-if="crud.status.add > 0"
              key="back"
              @click="crud.cancelCU()"
            >
              取消
            </a-button>
            <a-button
              v-if="crud.status.edit > 0"
              key="back"
              @click="crud.cancelCU('uptoinfo')"
            >
              取消
            </a-button>
            <a-button
              v-if="crud.status.add > 0"
              key="submit"
              type="primary"
              @click="crud.submitCU()"
            >
              提交
            </a-button>
            <a-button
              v-if="crud.status.edit > 0"
              key="submit"
              type="primary"
              @click="crud.submitCU()"
            >
              保存
            </a-button>
          </div>
          <div v-if="crud.status.in > 0 && crud.status.cu === 0">
            <a-button
              key="back"
              :disabled="!crud.permission.edit"
              @click="crud.toEdit()"
            >
              修改
            </a-button>
            <a-popconfirm
              cancel-text="取消"
              ok-text="删除"
              placement="topRight"
              @confirm="crud.doDelete(null, 'close')"
            >
              <template slot="title">
                你确定要删除吗？
              </template>
              <a-button
                key="submit"
                :disabled="!crud.permission.del"
                type="danger"
              >
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </template>
      </a-modal>

      <!--      审核-->
      <a-modal
        :afterClose="
          () => {
            currentOperateRecord = null
            form.checkType = null
            form.checkNote = ''
          }
        "
        :visible="showCheck"
        title="审核订单"
        width="30%"
        wrapClassName="stationListDialog"
        @cancel="showCheck = false"
        @ok="okCheck"
      >
        <a-form-model
          ref="form"
          :class="
            crud.status.in > 0 && crud.status.cu === 0 ? 'disabled-form' : ''
          "
          :label-col="{ span: 6 }"
          :model="form"
          :rules="rules"
          :wrapper-col="{ span: 12 }"
          labelAlign="left"
        >
          <a-form-model-item label="审核状态:" prop="checkType">
            <a-radio-group v-model="form.checkType">
              <a-radio
                v-for="item in checkTypeMap"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            label="备注"
            prop="checkNote"
          >
            <a-input v-model="form.checkNote" />
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
import Api, { checkOrder, invalidOrder } from "@/api/order/index"
import { getAll as getAllReceive } from "@/api/station/receive"
import { getAll as getAllOrigin } from "@/api/station/origin"
import { getAll as getAllGoods, getAllCategory } from "@/api/station/goods"
import {
  CHECK_TYPE,
  ORDER_STATUS,
  ORDER_STATUS_MAP,
  ORDER_TYPE,
  ORDER_TYPE_MAP,
  UNIT_TYPE_MAP
} from "@/config"
import { filterMapSearch, fullTimeFilter } from "@/utils/utils"
import { selectGoodsColumns } from "@/views/order/view-columns"

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
  checkType: null,
  checkNote: "",
  verifierID: null
}
export default {
  name: "Order",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "订单",
      columns: [
        {
          title: "单号",
          dataIndex: "orderNo",
          align: "center",
          width: 240
        },
        {
          title: "订单类型",
          // dataIndex: "status",
          width: 110,
          align: "center",
          scopedSlots: { customRender: "orderType" }
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
          title: "计划数(吨)",
          dataIndex: "goodsWeight",
          align: "center",
          width: 110
        },
        {
          title: "计划数(件)",
          dataIndex: "goodsNum",
          align: "center",
          width: 110
        },
        {
          title: "已派车",
          dataIndex: "goodsArranged",
          align: "center",
          width: 80
        },
        {
          title: "余量",
          dataIndex: "goodsMargin",
          align: "center",
          width: 80
        },

        {
          title: "单位",
          dataIndex: "goodsUnit",
          align: "center",
          width: 80
        },
        {
          title: "制单管理员",
          dataIndex: "creatorName",
          align: "center",
          width: 110
        },
        {
          title: "审核管理员",
          dataIndex: "verifierName",
          align: "center",
          width: 110
        },
        {
          title: "货品备注",
          dataIndex: "goodsNote",
          align: "center",
          width: 200
        },

        {
          title: "审核备注",
          dataIndex: "verifierNote",
          align: "center",
          width: 200
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
          align: "center",
          // dataIndex: "status",
          fixed: "right",
          width: 90,
          scopedSlots: { customRender: "status" }
        },
        {
          title: "操作",
          fixed: "right",
          width: 200,
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

      orderStatus: ORDER_STATUS,
      orderStatusMap: ORDER_STATUS_MAP,
      orderType: ORDER_TYPE,
      orderTypeMap: ORDER_TYPE_MAP,
      checkTypeMap: CHECK_TYPE,

      currentStep: 0,

      allReceiveMap: [],
      allOriginMap: [],
      allGoodsMap: [],
      allGoodsNameMap: [],
      allGoodsNoMap: [],
      allCategoryMap: [],

      currentOperateRecord: null,
      showCheck: false,

      selectGoodsColumns: selectGoodsColumns,

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
  watch: {
    currentStep: {
      handler(value) {
        switch (value) {
          case 0:
            this.form["orderType"] = null
            this.form["receiveType"] = null
            this.form["receiveID"] = null
            this.form["originType"] = null
            this.form["originID"] = null
            this.form["goodCategoryID"] = null
            this.form["goodsIDs"] = []
            this.form["selectGoods"] = []
            this.form["goodsID"] = null
            this.form["goodsNum"] = null
            this.form["goodsWeight"] = null
            this.form["goodsNote"] = ""
            break
          case 1:
            this.form["receiveID"] = null
            this.form["originType"] = null
            this.form["originID"] = null
            this.form["goodCategoryID"] = null
            this.form["goodsIDs"] = []
            this.form["selectGoods"] = []
            this.form["goodsID"] = null
            this.form["goodsNum"] = null
            this.form["goodsWeight"] = null
            this.form["goodsNote"] = ""
            break
          case 2:
            this.form["originID"] = null
            this.form["goodCategoryID"] = null
            this.form["goodsIDs"] = []
            this.form["selectGoods"] = []
            this.form["goodsID"] = null
            this.form["goodsNum"] = null
            this.form["goodsWeight"] = null
            this.form["goodsNote"] = ""
            break
          case 3:
            this.form["goodCategoryID"] = null
            this.form["goodsIDs"] = []
            this.form["selectGoods"] = []
            this.form["goodsID"] = null
            this.form["goodsNum"] = null
            this.form["goodsWeight"] = null
            this.form["goodsNote"] = ""
            break
        }
      },
      deep: true
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
      add: code.includes("新增订单"),
      del: code.includes("删除订单"),
      edit: code.includes("修改订单"),
      download: code.includes("下载订单")
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
    verifyTimeChange(dates, dateStrings) {
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
          this.crud.query.verifyTimes = [time1, time1]
          return
        }
      }
      this.crud.query.verifyTimes = dateStrings
    },

    toAddOrder() {
      if (this.currentStep !== 5) {
        alert("请完整的完成流程数据")
      } else {
        this.crud.submitCU()
      }
    },

    changeGoodsList() {
      if (this.form.goodsIDs && this.form.goodsIDs.length > 0) {
        this.form.selectGoods = this.allGoodsMap
          .filter(item => this.form.goodsIDs.includes(item.goodsID))
          .map(item => ({
            goodsID: item.goodsID,
            goodsName: item.name,
            goodsNo: item.goodsNo,
            goodsSpecification: item.specification,
            goodsWeight: 0,
            goodsNum: 0,
            extraWeight: item.extraWeight || 0,
            goodsNote: ""
          }))
        this.currentStep = 4
      } else {
        this.form.selectGoods = []
        this.currentStep = 3
      }
    },
    checkGoodsList() {
      if (
        this.form.selectGoods.find(item => !item.goodsNum || !item.goodsWeight)
      ) {
        this.currentStep = 4
      } else {
        this.currentStep = 5
      }
    },
    checkOrderOk(record) {
      this.currentOperateRecord = record
      this.showCheck = true
    },
    async okCheck() {
      if (!this.form.checkType) {
        this.$message.info("请选择审核结果")
        return
      }
      await checkOrder({
        orderID: this.currentOperateRecord.orderID,
        checkType: this.form.checkType,
        checkNote: this.form.checkNote
      })
      this.showCheck = false
      this.crud.refresh()
    },
    okInvalid(record) {
      invalidOrder({ orderID: record.orderID })
      this.crud.refresh()
    }
  }
}
</script>
