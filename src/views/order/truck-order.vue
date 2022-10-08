<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="派车单单号">
              <a-input
                v-model="crud.query.truckOrderNo"
                :allowClear="true"
                placeholder="请输入派车单单号"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="关联订单单号">
              <a-input
                v-model="crud.query.orderNo"
                :allowClear="true"
                placeholder="请输入关联订单单号"
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

          <template v-if="crud.advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="派车单状态">
                <a-select
                  v-model="crud.query.status"
                  :allowClear="true"
                  :filterOption="filterMapSearch"
                  placeholder="请选择派车单状态"
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
                  placeholder="请输入货品名称"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="货品编码">
                <a-input
                  v-model="crud.query.goodsNo"
                  :allowClear="true"
                  placeholder="请输入货品编码"
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

            <a-col :md="6" :sm="24"></a-col>
          </template>
          <a-col :md="6" :sm="24">
            <SearchOptions style="width: 100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="派车单列表" />
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
            <template v-if="record.status === 1">
              <a-button type="link" @click="checkOrderOk(record)">
                审核
              </a-button>
            </template>

            <template v-if="record.status != 4">
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
              :disabled="!$route.meta.code.includes('获取派车单详情')"
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
      <!--      创建-->
      <a-modal
        :afterClose="
          () => {
            currentStep = 0
            currentStep2 = 0
          }
        "
        :title="crud.status.title"
        :visible="crud.status.cu > 0 && crud.status.in === 0"
        :width="1400"
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
          <template v-if="form.orderType !== 3">
            <a-steps
              :current="currentStep"
              size="small"
              status="error"
              style="margin-bottom: 25px"
            >
              <a-step title="选择订单类型" />
              <a-step title="选择订单" />
              <a-step title="选择司机" />
              <a-step title="运输信息" />
              <a-step title="装卸货地点" />
              <a-step title="结算方式" />
            </a-steps>
          </template>

          <template v-if="form.orderType === 3">
            <a-steps
              :current="currentStep2"
              size="small"
              status="error"
              style="margin-bottom: 25px"
            >
              <a-step title="选择订单类型" />
              <a-step title="选择收货单位" />
              <a-step title="选择发货单位" />
              <a-step title="选择货品" />
              <a-step title="填写货品信息" />
              <a-step title="选择司机" />
              <a-step title="运输信息" />
              <a-step title="装卸货地点" />
              <a-step title="结算方式" />
            </a-steps>
          </template>

          <a-form-model-item label="订单类型:" prop="orderType">
            <a-radio-group
              v-model="form.orderType"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="changeOrderType"
            >
              <a-radio
                v-for="item in orderTypeMap"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <template v-if="form.orderType !== 3">
            <a-form-model-item
              v-if="currentStep > 0"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 16 }"
              label="订单相关关键字"
              prop="orderKey"
            >
              <a-input
                v-model="form.orderKey"
                :allowClear="true"
                :disabled="currentStep != 1"
                placeholder="订单号/收发货地址/商品名 模糊查询"
                style="width: 70%"
                @change="changeOrderKey"
              />

              <a-button
                style="margin-left: 60px"
                type="primary"
                @click="lockOrders"
              >
                锁定订单
              </a-button>
            </a-form-model-item>
            <span v-if="currentStep > 0" label="订单列表列表"> </span>
            <a-table
              v-if="currentStep > 0"
              :columns="selectOrderColumns"
              :dataSource="filterCheckedOrders"
              :row-selection="{
                selectedRowKeys: form.selectedOrderIDs,
                onChange: changeOrderSelects
              }"
              :scroll="{ x: 1600, y: 300, scrollToFirstRowOnChange: true }"
              rowKey="orderID"
            >
              <template slot="goodsLoadQuantity" slot-scope="record">
                <a-input
                  v-model="record.goodsLoadQuantity"
                  :disabled="
                    !form.selectedOrders.find(
                      item => item.orderID === record.orderID
                    )
                  "
                  allowClear
                  type="number"
                  @change="changeGoodsLoadQuantity(record)"
                />
              </template>
            </a-table>
          </template>

          <template v-if="form.orderType === 3">
            <!--            收货单位-->
            <a-form-model-item
              v-if="currentStep2 > 0"
              label="收货单位类型"
              prop="receiveType"
            >
              <a-radio-group
                v-model="form.receiveType"
                @change="changeReceiveType"
              >
                <a-radio
                  v-for="item in unitMap"
                  :key="item.key"
                  :value="item.key"
                  >{{ item.value }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item
              v-if="currentStep2 > 0"
              label="收货单位名称"
              prop="receiveID"
            >
              <a-select
                v-model="form.receiveID"
                :allowClear="true"
                :filterOption="filterMapSearch"
                placeholder="请选择收货地名称"
                show-search
                @change="
                  form.receiveID ? (currentStep2 = 2) : (currentStep2 = 1)
                "
              >
                <a-select-option
                  v-for="item in filterReceiveMap"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <!--          发货单位-->
            <a-form-model-item
              v-if="currentStep2 > 1"
              label="发货单位类型"
              prop="originType"
            >
              <a-radio-group
                v-model="form.originType"
                @change="changeOriginType"
              >
                <a-radio
                  v-for="item in unitMap"
                  :key="item.key"
                  :value="item.key"
                  >{{ item.value }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item
              v-if="currentStep2 > 1"
              label="发货单位地址"
              prop="originID"
            >
              <a-select
                v-model="form.originID"
                :allowClear="true"
                :filterOption="filterMapSearch"
                placeholder="请选择发货地址"
                show-search
                @change="
                  form.originID ? (currentStep2 = 3) : (currentStep2 = 2)
                "
              >
                <a-select-option
                  v-for="item in filterOriginMap"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <!--选择货品-->
            <a-form-model-item
              v-if="currentStep2 > 2"
              label="货物类型"
              prop="goodCategoryID"
            >
              <a-select
                v-model="form.goodCategoryID"
                :allowClear="true"
                placeholder="请选择货物类型"
                show-search
                @change="changeGoodsCategoryID"
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
              v-if="currentStep2 > 2"
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
                  v-for="item in filterGoodsMap"
                  :key="item.goodsID"
                  :value="item.goodsID"
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <!--          获取列表-->
            <span v-if="currentStep2 > 3" label="货物列表"> </span>
            <a-table
              v-if="currentStep2 > 3"
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
          </template>

          <a-form-model-item
            v-if="currentStep > 1 || currentStep2 > 4"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 16 }"
            label="车辆相关关键字"
            prop="vehicleKey"
          >
            <a-input
              v-model="form.vehicleKey"
              :allowClear="true"
              placeholder="车牌号/司机姓名/司机手机号 模糊查询"
              style="width: 70%"
              @change="changeVehicleKey"
            />
          </a-form-model-item>
          <span v-if="currentStep > 1 || currentStep2 > 4" label="车辆列表">
          </span>
          <a-table
            v-if="currentStep > 1 || currentStep2 > 4"
            :columns="selectVehicleColumns"
            :dataSource="filterVehicle"
            :row-selection="{
              selectedRowKeys: form.selectedVehicleIDs,
              onChange: changeVehicleSelects
            }"
            :scroll="{ y: 300, scrollToFirstRowOnChange: true }"
            rowKey="driverID"
          >
          </a-table>

          <!--        运输信息-->
          <template v-if="currentStep > 2 || currentStep2 > 5">
            <a-form-model-item
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 8 }"
              label="是否限重:"
              prop="isWeightLimit"
            >
              <a-radio-group
                v-model="form.isWeightLimit"
                :disabled="crud.status.in > 0 && crud.status.cu === 0"
                @change="
                  () => {
                    if (form.isWeightLimit && form.driverTime) {
                      currentStep = 4
                      currentStep2 = 7
                    }
                  }
                "
              >
                <a-radio
                  v-for="item in isWeightLimitMap"
                  :key="item.key"
                  :value="item.key"
                  >{{ item.value }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>

            <!--运输时间-->
            <a-form-model-item
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 8 }"
              label="运输时间:"
              prop="driverTime"
            >
              <a-date-picker
                :value="form.driverTime"
                format="YYYY-MM-DD"
                placeholder="请选择派送时间"
                @change="changeDriverTime"
              />
            </a-form-model-item>

            <a-form-model-item label="输入集装箱号/柜号" prop="containerNo">
              <a-input v-model="form.containerNo" />
            </a-form-model-item>
          </template>

          <a-form-model-item
            v-if="currentStep > 3 || currentStep2 > 6"
            label="选择装货地点"
            prop="cargotoID"
          >
            <a-select
              v-model="form.cargotoID"
              :allowClear="true"
              :filterOption="filterMapSearch"
              placeholder="请选择装卸货地点"
              show-search
              @change="changeCargotoID"
            >
              <a-select-option
                v-for="item in allCargotoMap"
                :key="item.cargotoID"
                :value="item.cargotoID"
                >{{ item.cargotoName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            v-if="currentStep > 4 || currentStep2 > 7"
            label="结算方式:"
            prop="paymentMethod"
          >
            <a-radio-group
              v-model="form.paymentMethod"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="changePaymentMethod"
            >
              <a-radio
                v-for="item in paymentMethodMap"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}
              </a-radio>
            </a-radio-group>
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
              v-if="crud.status.add > 0"
              key="submit"
              type="primary"
              @click="toAddOrder"
            >
              提交
            </a-button>
          </div>
        </template>
      </a-modal>

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
        title="审核派车单"
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
import Api, {
  checkOrder,
  getAllCargoto,
  getAllDrivers,
  invalidOrder
} from "@/api/order/truck-oder"
import { getAll as getAllReceive } from "@/api/station/receive"
import { getAll as getAllOrigin } from "@/api/station/origin"
import { getAllCheckedOrder, getOrderInfo } from "@/api/order"
import { getAll as getAllGoods, getAllCategory } from "@/api/station/goods"
import {
  CHECK_TYPE,
  PAYMENT_METHOD_MAP,
  TRUCK_ORDER_STATUS,
  TRUCK_ORDER_STATUS_MAP,
  TRUCK_ORDER_TYPE,
  TRUCK_ORDER_TYPE_MAP,
  UNIT_TYPE_MAP,
  WEIGHT_LIMIT_MAP
} from "@/config"
import { filterMapSearch, fullTimeFilter } from "@/utils/utils"
import { DatePicker } from "element-ui"
import {
  selectGoodsColumns,
  selectOrderColumns,
  selectVehicleColumns
} from "@/views/order/view-columns"

// 表格的填充字段
const defaultForm = {
  orderType: null,
  checkType: null,
  checkNote: "",

  orderKey: "",
  selectedOrderIDs: [],
  selectedOrders: [],
  vehicleKey: "",
  selectedVehicleIDs: [],
  selectedVehicleID: null,
  selectedVehicle: null,
  isWeightLimit: null,
  driverTime: "",
  containerNo: "",
  cargotoID: null,
  paymentMethod: null,

  receiveID: null,
  originID: null,
  receiveType: null,
  originType: null,
  goodCategoryID: null,
  goodsIDs: [],
  selectGoods: []
}

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
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...Api },
      idField: "truckOrderID", // 设置每一条记录的唯一标失
      queryFun: (data, crud) => {
        if (
          data.code === 0 &&
          data.result &&
          data.result.list &&
          data.result.list.length &&
          data.result.list.length > 0
        ) {
          crud.data = data.result.list
          crud.page.total = data.result.count
        } else {
          crud.data = []
          crud.page.total = 0
        }

        crud.resetDataStatus()
      }
    })
  },
  filters: {},
  data() {
    return {
      unitMap: UNIT_TYPE_MAP,
      orderStatus: TRUCK_ORDER_STATUS,
      orderStatusMap: TRUCK_ORDER_STATUS_MAP,
      orderType: TRUCK_ORDER_TYPE,
      orderTypeMap: TRUCK_ORDER_TYPE_MAP,
      checkTypeMap: CHECK_TYPE,
      isWeightLimitMap: WEIGHT_LIMIT_MAP,
      paymentMethodMap: PAYMENT_METHOD_MAP,

      activeKey: 1,
      currentStep: 0,
      currentStep2: 0,

      currentOperateRecord: null,
      showCheck: false,

      allReceiveMap: [],
      allOriginMap: [],
      allCheckedOrders: [],
      allVehicle: [],
      allCargotoMap: [],
      allGoodsMap: [],
      allCategoryMap: [],

      filterReceiveMap: [],
      filterOriginMap: [],
      filterGoodsMap: [],
      filterCheckedOrders: [],
      filterVehicle: [],

      selectGoodsColumns: selectGoodsColumns,
      selectOrderColumns: selectOrderColumns,
      selectVehicleColumns: selectVehicleColumns,

      rules: {
        orderType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],

        isWeightLimit: [
          { required: true, message: "请选择是否限重", trigger: "change" }
        ],
        cargotoID: [
          { required: true, message: "请选择装卸货地点", trigger: "change" }
        ],
        driverTime: [
          { required: true, message: "请选择装派送时间", trigger: "change" }
        ],
        paymentMethod: [
          { required: true, message: "请选择结算方式", trigger: "change" }
        ]
      }
    }
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { SearchOptions, Operations, Pagination, DatePicker },
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
      add: code.includes("新增派车单"),
      del: code.includes("删除派车单"),
      edit: code.includes("修改派车单"),
      download: code.includes("下载派车单")
    }

    const [
      receiveListRes,
      originListRes,
      getAllCheckedOrderRes,
      getAllDriverRes,
      getAllCargotoRes,
      goodsListRes,
      getAllCategoryRes
    ] = await Promise.all([
      getAllReceive(),
      getAllOrigin(),
      getAllCheckedOrder(),
      getAllDrivers(),
      getAllCargoto(),
      getAllGoods(),
      getAllCategory()
    ])
    if (receiveListRes.code === 0) {
      this.allReceiveMap = receiveListRes.result.list.map(item => ({
        id: item.receiveID,
        type: item.type,
        name: item.name
      }))
      this.filterReceiveMap = this.allReceiveMap
    }

    if (originListRes.code === 0) {
      this.allOriginMap = originListRes.result.list.map(item => ({
        id: item.originID,
        type: item.type,
        name: item.name
      }))
      this.filterOriginMap = this.allOriginMap
    }

    if (getAllCheckedOrderRes.code == 0) {
      this.allCheckedOrders = getAllCheckedOrderRes.result
      this.filterCheckedOrders = getAllCheckedOrderRes.result
    }

    if (getAllDriverRes.code == 0) {
      this.allVehicle = getAllDriverRes.result
      this.filterVehicle = getAllDriverRes.result
    }

    if (getAllCargotoRes.code == 0) {
      this.allCargotoMap = getAllCargotoRes.result
    }

    if (goodsListRes.code === 0) {
      this.allGoodsMap = goodsListRes.result.list

      this.filterGoodsMap = this.allGoodsMap
    }

    if (getAllCategoryRes.code === 0) {
      this.allCategoryMap = getAllCategoryRes.result.list.map(item => ({
        id: item.categoryID,
        name: item.name
      }))
    }
  },
  watch: {
    currentStep: {
      handler(value) {
        switch (value) {
          case 0:
            this.filterCheckedOrders = this.allCheckedOrders
            this.filterVehicle = this.allVehicle
            this.crud.form["orderType"] = null
            this.crud.form["orderKey"] = ""
            this.crud.form["selectedOrderIDs"] = []
            this.crud.form["selectedOrders"] = []
            this.crud.form["vehicleKey"] = ""
            this.crud.form["selectedVehicleIDs"] = []
            this.crud.form["selectedVehicleID"] = null
            this.crud.form["selectedVehicle"] = null
            this.crud.form["isWeightLimit"] = null
            this.crud.form["driverTime"] = ""
            this.crud.form["containerNo"] = ""
            this.crud.form["cargotoID"] = null
            this.crud.form["paymentMethod"] = null
            break
          case 1:
            this.filterVehicle = this.allVehicle
            this.crud.form["vehicleKey"] = ""
            this.crud.form["selectedVehicleIDs"] = []
            this.crud.form["selectedVehicleID"] = null
            this.crud.form["selectedVehicle"] = null
            this.crud.form["isWeightLimit"] = null
            this.crud.form["driverTime"] = ""
            this.crud.form["containerNo"] = ""
            this.crud.form["cargotoID"] = null
            this.crud.form["paymentMethod"] = null
            break
          case 2:
            this.crud.form["isWeightLimit"] = null
            this.crud.form["driverTime"] = ""
            this.crud.form["containerNo"] = ""
            this.crud.form["cargotoID"] = null
            this.crud.form["paymentMethod"] = null
            break
          case 3:
            this.crud.form["cargotoID"] = null
            this.crud.form["paymentMethod"] = null
            break
          case 4:
            this.crud.form["paymentMethod"] = null
            break
        }
      },
      deep: true
    },
    currentStep2: {
      handler(value) {
        switch (value) {
          case 0:
            this.crud.form["orderType"] = null
            this.crud.form["receiveID"] = null
            this.crud.form["originID"] = null
            this.crud.form["receiveType"] = null
            this.crud.form["originType"] = null
            this.crud.form["goodCategoryID"] = null
            this.crud.form["goodsIDs"] = []
            this.crud.form["selectGoods"] = []

            this.filterReceiveMap = this.allReceiveMap
            this.filterOriginMap = this.allOriginMap
            this.filterGoodsMap = this.allGoodsMap
            this.filterVehicle = this.allVehicle
            break
          case 1:
            this.crud.form["receiveID"] = null
            this.crud.form["originID"] = null
            this.crud.form["receiveType"] = null
            this.crud.form["originType"] = null
            this.crud.form["goodCategoryID"] = null
            this.crud.form["goodsIDs"] = []
            this.crud.form["selectGoods"] = []
            this.filterReceiveMap = this.allReceiveMap
            this.filterOriginMap = this.allOriginMap
            this.filterGoodsMap = this.allGoodsMap
            this.filterVehicle = this.allVehicle
            break
          case 2:
            this.crud.form["originID"] = null
            this.crud.form["originType"] = null
            this.crud.form["goodCategoryID"] = null
            this.crud.form["goodsIDs"] = []
            this.crud.form["selectGoods"] = []
            this.filterOriginMap = this.allOriginMap
            this.filterGoodsMap = this.allGoodsMap
            this.filterVehicle = this.allVehicle
            break
          case 3:
            this.crud.form["goodCategoryID"] = null
            this.crud.form["goodsIDs"] = []
            this.crud.form["selectGoods"] = []
            this.filterGoodsMap = this.allGoodsMap
            this.filterVehicle = this.allVehicle
            break
          case 4:
            break
          case 5:
            this.crud.form["vehicleKey"] = ""
            this.crud.form["selectedVehicleIDs"] = []
            this.crud.form["selectedVehicleID"] = null
            this.crud.form["selectedVehicle"] = null
            this.crud.form["isWeightLimit"] = null
            this.crud.form["driverTime"] = ""
            this.crud.form["containerNo"] = ""
            this.crud.form["cargotoID"] = null
            this.crud.form["paymentMethod"] = null
            break
          case 6:
            this.crud.form["isWeightLimit"] = null
            this.crud.form["driverTime"] = ""
            this.crud.form["containerNo"] = ""
            this.crud.form["cargotoID"] = null
            this.crud.form["paymentMethod"] = null
            break
          case 7:
            this.crud.form["cargotoID"] = null
            this.crud.form["paymentMethod"] = null
            break
          case 8:
            this.crud.form["paymentMethod"] = null
            break
        }
      },
      deep: true
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
    checkOrderOk(record) {
      this.currentOperateRecord = record
      this.showCheck = true
    },
    async okCheck() {
      if (!this.form.checkType) {
        this.$message.error("请选择审核结果")
        return
      }
      await checkOrder({
        truckOrderID: this.currentOperateRecord.truckOrderID,
        checkType: this.form.checkType,
        checkNote: this.form.checkNote
      })
      this.showCheck = false
      this.crud.refresh()
    },
    okInvalid(record) {
      invalidOrder({ truckOrderID: record.truckOrderID })
      this.crud.refresh()
    },

    changeOrderType() {
      if (this.form.orderType) {
        this.currentStep = 1
        this.currentStep2 = 1
      } else {
        this.currentStep = 0
        this.currentStep2 = 0
      }
      if (Number(this.form.orderType) !== 3) {
        this.filterCheckedOrders = this.allCheckedOrders.filter(
          item => item.orderType === Number(this.form.orderType)
        )

        this.form["orderKey"] = ""
        this.form["selectedOrderIDs"] = []
        this.form["selectedOrders"] = []
      }
    },

    changeReceiveType() {
      const that = this
      if (this.form.receiveType && this.form.receiveType !== 0) {
        this.filterReceiveMap = this.allReceiveMap.filter(
          item => item.type === that.form.receiveType
        )
      } else {
        this.filterReceiveMap = this.allReceiveMap
      }
      this.form.receiveID = null
    },

    changeOriginType() {
      const that = this
      if (this.form.originType && this.form.originType !== 0) {
        this.filterOriginMap = this.allOriginMap.filter(
          item => item.type === that.form.originType
        )
      } else {
        this.filterOriginMap = this.allOriginMap
      }
      this.form.originID = null
    },

    changeGoodsCategoryID() {
      const categoryID = this.form.goodCategoryID
      if (categoryID) {
        this.filterGoodsMap = this.allGoodsMap.filter(
          item => item.categoryID === categoryID
        )
      } else {
        this.filterGoodsMap = this.allGoodsMap
      }
    },

    changeGoodsList() {
      console.log(`this.form.goodsIDs : ${JSON.stringify(this.form.goodsIDs)}`)
      if (this.form.goodsIDs && this.form.goodsIDs.length > 0) {
        this.form.selectGoods = this.allGoodsMap
          .filter(item => this.form.goodsIDs.includes(item.goodsID))
          .map(item => ({
            goodsID: item.goodsID,
            goodsName: item.name,
            goodsNo: item.goodsNo,
            goodsSpecification: item.specification,
            goodsWeight: 0,
            extraWeight: item.extraWeight || 0,
            goodsNum: 0,
            goodsNote: ""
          }))
        this.currentStep2 = 4
      } else {
        this.form.selectGoods = []
        this.currentStep2 = 3
      }
    },

    checkGoodsList() {
      if (
        this.form.selectGoods.find(
          item => item.goodsNum <= 0 || item.goodsWeight <= 0
        )
      ) {
        this.currentStep2 = 4
      } else {
        this.currentStep2 = 5
      }
    },

    changeGoodsLoadQuantity(record) {
      if (!isNaN(Number(record.goodsLoadQuantity))) {
        record.goodsLoadQuantity = Number(record.goodsLoadQuantity)
        if (record.goodsLoadQuantity < 0) {
          record.goodsLoadQuantity = 0
        } else if (record.goodsLoadQuantity > record.goodsMargin) {
          record.goodsLoadQuantity = record.goodsMargin
        }
      }
      if (
        isNaN(Number(record.goodsLoadQuantity)) ||
        Number(record.goodsLoadQuantity) == 0
      ) {
        this.currentStep = 1
      }
    },

    changeOrderKey() {
      if (this.form.orderKey && this.form.orderKey.trim()) {
        this.filterCheckedOrders = this.allCheckedOrders.filter(item => {
          return (
            item.orderNo
              .toLowerCase()
              .includes(this.form.orderKey.trim().toLowerCase()) ||
            item.originName
              .toLowerCase()
              .includes(this.form.orderKey.trim().toLowerCase()) ||
            item.receiveName
              .toLowerCase()
              .includes(this.form.orderKey.trim().toLowerCase()) ||
            item.goodsName
              .toLowerCase()
              .includes(this.form.orderKey.trim().toLowerCase())
          )
        })
      } else {
        this.filterCheckedOrders = this.allCheckedOrders
      }
      this.form.selectedOrderIDs = []
      this.form.selectedOrders = []
    },
    changeVehicleKey() {
      if (this.form.vehicleKey && this.form.vehicleKey.trim()) {
        const vehicleKeyStr = this.form.vehicleKey.trim()
        this.filterVehicle = this.allVehicle.filter(item => {
          return (
            item.vehicleNumber
              .toLowerCase()
              .includes(vehicleKeyStr.toLowerCase()) ||
            item.tel.toLowerCase().includes(vehicleKeyStr.toLowerCase()) ||
            item.driverName.toLowerCase().includes(vehicleKeyStr.toLowerCase())
          )
        })
      } else {
        this.filterVehicle = this.allVehicle
      }
      this.form.selectedVehicleIDs = []
      this.form.selectedVehicleID = null
      this.form.selectedVehicle = null
    },

    changeOrderSelects(electedRowKeys, selectedRows) {
      this.form.selectedOrderIDs = electedRowKeys
      this.form.selectedOrders = [...selectedRows]
    },

    changeVehicleSelects(electedRowKeys, selectedRows) {
      if (electedRowKeys.length > 0) {
        this.form.selectedVehicleIDs = [
          electedRowKeys[electedRowKeys.length - 1]
        ]
        this.form.selectedVehicleID = electedRowKeys[electedRowKeys.length - 1]
        this.form.selectedVehicle = selectedRows[electedRowKeys.length - 1]
        this.filterVehicle = [selectedRows[electedRowKeys.length - 1]]

        this.currentStep = 3
        this.currentStep2 = 6
      } else {
        this.changeVehicleKey()
        this.currentStep = 2
        this.currentStep2 = 5
      }
    },

    lockOrders() {
      if (!this.form.selectedOrders || this.form.selectedOrders.length == 0) {
        return this.$message.error("请先勾选订单，并填写装车量")
      }

      if (this.form.selectedOrders.find(item => !item.goodsLoadQuantity)) {
        return this.$message.error("请全部填写勾选的订单的 装车数 !")
      }

      this.filterCheckedOrders = [...this.form.selectedOrders]
      this.currentStep = 2
    },

    changeDriverTime(value, dateString) {
      this.form.driverTime = dateString
      if (this.form.isWeightLimit && this.form.driverTime) {
        this.currentStep = 4
        this.currentStep2 = 7
      }
    },

    changeCargotoID() {
      if (this.form.cargotoID) {
        this.currentStep = 5
        this.currentStep2 = 8
      }
    },

    changePaymentMethod() {
      if (this.form.paymentMethod) {
        this.currentStep = 6
        this.currentStep2 = 9
      }
    },
    toAddOrder() {
      if (this.currentStep !== 6) {
        alert("请完成所有流程")
      } else {
        this.crud.submitCU()
        this.filterCheckedOrders = this.allCheckedOrders.map(item => {
          if (item.goodsLoadQuantity) {
            item.goodsLoadQuantity = null
          }
          return item
        })
        this.filterVehicle = this.allVehicle
      }
    },

    async toInfoTruckOrder(record) {
      console.log(`record : ${JSON.stringify(record)}`)
      const orderInfo = await getOrderInfo({ orderID: record.orderID })
      if (orderInfo.code === 0) {
        this.form = {
          ...record,
          goodsMargin: orderInfo.result.goodsMargin,
          goodsWeight: orderInfo.result.goodsWeight
        }
      } else {
        this.form = { ...record }
      }
      this.crud.toInfo(record)
    },
    callback(key) {
      console.log(key)
      this.activeKey = key
    }
  }
}
</script>
