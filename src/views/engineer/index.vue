<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <div class="head-container">
      <!-- 给crud的query添加参数，执行封装的toQuery方法实现查询 -->
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="所属站">
              <a-select v-model="crud.query.stationID" placeholder="请选择">
                <a-select-option
                  v-for="item in stationData"
                  :key="item.stationID"
                  :value="item.stationID"
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="企业名称">
              <a-input
                v-model="crud.query.enterpriseName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <SearchOptions :toggleShowAdvance="false" />
        </a-row>
      </a-form>
    </div>
    <!-- 表格部分 -->
    <div class="table-container">
      <Operations tableName="企业列表">
        <div slot="left" class="_left">
          <a-dropdown
            v-if="
              $route.meta.code.includes('新增企业') ||
                $route.meta.code.includes('新增车队')
            "
          >
            <a-button type="primary">
              新建
              <a-icon type="down" />
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item
                :disabled="!$route.meta.code.includes('新增企业')"
                @click="crud.toAdd"
              >
                新建企业
              </a-menu-item>
              <a-menu-item
                :disabled="!$route.meta.code.includes('新增车队')"
                @click="addFleet"
                >新建车队
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </Operations>
      <a-spin :spinning="crud.loading">
        <a-table
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="operation" slot-scope="record">
            <!-- :disabled="!$route.meta.code.includes('修改企业')" -->

            <a-button
              type="link"
              @click="
                toInfo(record)
                crud.toInfo(record)
              "
            >
              详情
            </a-button>
            |
            <a-button
              :disabled="!$route.meta.code.includes('获取权限企业列表')"
              type="link"
              @click="bussinessInfo(record)"
            >
              业务信息
            </a-button>
            |
            <a-button
              :disabled="!$route.meta.code.includes('获取车队列表')"
              type="link"
              @click="vTeamInfo(record)"
            >
              车队信息
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <map-drag
      :lat.sync="lat"
      :lng.sync="lng"
      :mapVisible.sync="mapVisible"
      :type="showType"
      @getLocation="getLocation"
    ></map-drag>
    <!-- 填写表单部分 -->
    <div class="form-container">
      <a-modal
        :title="crud.status.title"
        :visible="crud.status.cu > 0 || crud.status.in > 0"
        wrapClassName="engineerDialog"
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
          :wrapper-col="{ span: 18 }"
          labelAlign="left"
        >
          <a-form-model-item label="企业名称:" prop="name">
            <a-input
              v-model="form.name"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="销售姓名:" prop="userID">
            <a-select
              v-model="form.userID"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in xsList"
                :key="item.userID"
                :value="item.userID"
                >{{ item.displayName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="所属服务站:" prop="stationID">
            <a-select
              v-model="form.stationID"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in stationData"
                :key="item.stationID"
                :value="item.stationID"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="企业类别:" prop="enterpriseType">
            <a-select
              v-model="form.enterpriseType"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in companytypeList"
                :key="item.key"
                :value="item.value"
                >{{ item.key }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="行业类别:" prop="industryType">
            <a-select
              v-model="form.industryType"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in industrytypeList"
                :key="item.key"
                :value="item.value"
                >{{ item.key }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="企业联系人:" prop="contactPerson">
            <a-input
              v-model="form.contactPerson"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="联系人电话:" prop="phoneNum">
            <a-input
              v-model="form.phoneNum"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item
            class="address-form-model-item"
            label="企业地址:"
            prop="address"
          >
            <div v-show="crud.status.cu === 0" style="padding-left:10px">
              {{ form.address }}
            </div>
            <a-input
              v-if="crud.status.cu > 0"
              v-model="form.address"
              :disabled="true"
            />
            <a-button
              v-if="crud.status.cu > 0"
              type="primary"
              @click="showMap({}, 'choose')"
              >选择地址
            </a-button>
          </a-form-model-item>
          <a-form-model-item label="法人姓名:" prop="legalName">
            <a-input
              v-model="form.legalName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="备注:" prop="remark">
            <a-input
              v-model="form.remark"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="营业执照照片:" prop="licensePic">
            <!-- <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.licensePic"
            /> -->
            <div v-show="crud.status.cu === 0 && !form.licensePic">
              暂无照片
            </div>
            <div
              v-show="crud.status.cu === 0 && form.licensePic"
              :style="{ 'background-image': `url(${form.licensePic})` }"
              style="margin-left:10px;width: 200px;height: 200px;background-position: center;background-repeat: no-repeat;background-size: contain;"
            ></div>
            <a-upload
              v-show="crud.status.cu > 0"
              :before-upload="beforeUpload"
              :default-file-list="fileList"
              class="upload-list-inline"
              list-type="picture"
              @change="uploadChange"
            >
              <a-button>
                <a-icon type="upload" />
                上传图片
              </a-button>
            </a-upload>
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <div v-if="crud.status.cu > 0">
            <a-button
              v-if="crud.status.add > 0"
              key="back"
              @click="crud.resetForm()"
            >
              重置
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
      <a-modal
        :visible="showBusiness"
        :width="1080"
        title="业务信息"
        wrapClassName="businessDialog"
        @cancel="
          showBusiness = false
          businessObj = { enterpriseInfo: {}, fleetInfoList: [] }
        "
      >
        <div class="_top">
          <div class="_t1">
            <div class="_l _bold">客户基本信息</div>
            <div class="_r">
              <div>
                <span class="_bold">销售姓名：</span
                >{{ businessObj.enterpriseInfo.displayName }}
              </div>
              <div>
                <span class="_bold">销售电话：</span
                >{{ businessObj.enterpriseInfo.phoneTel }}
              </div>
            </div>
          </div>
          <div class="_t2">
            <a-row>
              <a-col :span="6">
                客户名称：{{ businessObj.enterpriseInfo.name }}
              </a-col>
              <a-col :span="6">
                行业类别：{{ businessObj.enterpriseInfo.industryType }}
              </a-col>
              <a-col :span="6">
                联系人：{{ businessObj.enterpriseInfo.contactPerson }}
              </a-col>
              <a-col :span="6">
                联系电话：{{ businessObj.enterpriseInfo.phoneNum }}
              </a-col>
            </a-row>
          </div>
          <div class="_t3">
            <a-row>
              <a-col :span="12">
                联系地址：{{ businessObj.enterpriseInfo.address }}
              </a-col>
              <a-col :span="12">
                备注：{{ businessObj.enterpriseInfo.remark }}
              </a-col>
            </a-row>
          </div>
          <div class="_t4">
            <a-row>
              <a-col :span="6">
                车队数量：{{ businessObj.fleetInfoList.length }}
              </a-col>
              <a-col :span="6">
                车头（辆）：{{ businessObj.enterpriseInfo.CT }}
              </a-col>
              <a-col :span="6">
                挂车（辆）：{{ businessObj.enterpriseInfo.GC }}
              </a-col>
              <a-col :span="3">
                整车（辆）：{{ businessObj.enterpriseInfo.ZC }}
              </a-col>
              <a-col :span="3">
                服务轮位：{{ businessObj.enterpriseInfo.TYRENUM }}
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="_bottom">
          <a-collapse :bordered="false" default-active-key="1">
            <a-collapse-panel
              v-for="(item, index) in businessObj.fleetInfoList"
              :key="index"
              :header="item.fleetName || '未命名车队'"
            >
              <div class="_t1">
                <a-row>
                  <a-col :span="6">
                    付费方式：{{
                      item.fleetPayType === null
                        ? ""
                        : item.fleetPayType === 1
                        ? "预付"
                        : "后付"
                    }}
                  </a-col>
                  <a-col :span="6">
                    计费方式：{{
                      item.fleetChargingType === null
                        ? ""
                        : item.fleetChargingType === 1
                        ? "按时间计费"
                        : item.fleetChargingType === 2
                        ? "按里程计费"
                        : "按方量计费"
                    }}
                  </a-col>
                  <a-col v-if="item.fleetChargingType === 1" :span="6">
                    单胎单月收费：{{ item.fleetTyreMonthCharge }}
                  </a-col>
                  <a-col v-if="item.fleetChargingType === 2" :span="6">
                    单胎单公里收费：{{ item.fleetTyreKmCharge }}
                  </a-col>
                  <a-col v-if="item.fleetChargingType == 3" :span="6">
                    单公里方量收费：{{ item.fleetTyreKmCharge }}
                  </a-col>
                </a-row>
              </div>
              <div class="_t2">
                <a-row>
                  <a-col
                    v-for="(sitem, sindex) in item.vehicleObject"
                    :key="sindex"
                    :span="8"
                  >
                    <div v-if="sitem.vehicleType === 2">
                      <div>车头（辆）：{{ sitem.vehicleAmount }}</div>
                      <div>服务轮位：{{ sitem.vehicleInstallTyreAmount }}</div>
                    </div>
                    <div v-if="sitem.vehicleType === 1">
                      <div>挂车（辆）：{{ sitem.vehicleAmount }}</div>
                      <div>服务轮位：{{ sitem.vehicleInstallTyreAmount }}</div>
                    </div>
                    <div v-if="sitem.vehicleType === 3">
                      <div>整车（辆）：{{ sitem.vehicleAmount }}</div>
                      <div>服务轮位：{{ sitem.vehicleInstallTyreAmount }}</div>
                    </div>
                  </a-col>
                </a-row>
              </div>
              <div class="_t3">
                轮胎使用情况
              </div>
              <div class="_t4">
                <a-row>
                  <a-col
                    v-for="(sitem, sindex) in item.tyreObject"
                    :key="sindex"
                    :span="6"
                  >
                    <div v-if="sitem.tyreStatus === 1">
                      新胎（条）：{{ sitem.tyreAmount }}
                    </div>
                    <div v-if="sitem.tyreStatus === 2">
                      回收胎（条）：{{ sitem.tyreAmount }}
                    </div>
                    <div v-if="sitem.tyreStatus === 4">
                      翻新胎（条）：{{ sitem.tyreAmount }}
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-modal>

      <a-modal
        :title="fleetTitle"
        :visible="fleetAdd > 0 || fleetEdit > 0 || fleetInfo > 0"
        :width="780"
        wrapClassName="fleetDialog"
        @cancel="cancelCU()"
      >
        企业名称：
        <a-select
          v-model="selectEnterpriseID"
          :disabled="fleetInfo > 0 && fleetAdd === 0 && fleetEdit === 0"
          :filter-option="false"
          :not-found-content="null"
          :show-arrow="false"
          placeholder="请选择"
          show-search
          style="width:350px"
          @search="handleSearch"
        >
          <a-select-option
            v-for="item in allEnterprise"
            :key="item.enterpriseID"
            :value="item.enterpriseID"
            >{{ item.NAME }}
          </a-select-option>
        </a-select>
        <div v-for="(item, index) in fleetList" :key="index">
          <a-divider />
          <a-form-model
            :ref="`fleetform${index}`"
            :class="item.formstatus === 'info' ? 'disabled-form' : ''"
            :label-col="{ span: 10 }"
            :model="item"
            :rules="fleetrules"
            :wrapper-col="{ span: 14 }"
            labelAlign="left"
            layout="inline"
          >
            <a-form-model-item
              class="_fleetName"
              label="车队名称:"
              prop="fleetName"
            >
              <!-- @focus="focusform = index"
                  focusform = index -->

              <a-input
                v-model="item.fleetName"
                :disabled="item.formstatus === 'info'"
                @blur="checkFleetName(item, index)"
                @change="item.namePassed = ''"
              />
              <span
                v-show="item.namePassed === false"
                class="al"
                style="color:red"
                >该车队已存在！</span
              >
            </a-form-model-item>
            <a-form-model-item class="_optItem">
              <div>
                <a-button
                  v-if="item.formstatus === 'info'"
                  key="back"
                  :disabled="!$route.meta.code.includes('修改车队')"
                  @click="editFleet(item, index)"
                >
                  修改
                </a-button>
                <a-popconfirm
                  v-if="
                    item.formstatus === 'info' || (fleetAdd > 0 && index !== 0)
                  "
                  cancel-text="取消"
                  ok-text="删除"
                  placement="topRight"
                  @confirm="delFleet(item, index)"
                >
                  <template slot="title">
                    你确定要删除吗？
                  </template>
                  <a-button key="submit" type="danger">
                    删除
                  </a-button>
                </a-popconfirm>
                <a-button
                  v-if="item.formstatus === 'edit'"
                  key="back"
                  @click="cancelFleet(index)"
                >
                  取消
                </a-button>
                <a-button
                  v-if="item.formstatus === 'edit'"
                  key="submit"
                  type="primary"
                  @click="saveFleet(index)"
                >
                  保存
                </a-button>
              </div>
            </a-form-model-item>
            <a-form-model-item label="付费方式:" prop="fleetPayType">
              <a-select
                v-model="item.fleetPayType"
                :disabled="item.formstatus === 'info'"
                placeholder="请选择付费方式"
              >
                <a-select-option :value="1">预付</a-select-option>
                <a-select-option :value="2">后付</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="计费方式:" prop="fleetChargingType">
              <a-select
                v-model="item.fleetChargingType"
                :disabled="item.formstatus === 'info'"
                placeholder="请选择计费方式"
                @change="
                  item.fleetTyreMonthCharge = ''
                  item.fleetTyreKmCharge = ''
                "
              >
                <a-select-option :value="1">按时间计费</a-select-option>
                <a-select-option :value="2">按里程计费</a-select-option>
                <a-select-option :value="3">按方量计费</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              v-if="item.fleetChargingType === 1"
              label="单胎单月收费:"
              prop="fleetTyreMonthCharge"
            >
              <a-tooltip placement="right">
                <template slot="title">
                  <span>请输入签订合同时的收费价格</span>
                </template>
                <a-input-number
                  v-model="item.fleetTyreMonthCharge"
                  :disabled="item.formstatus === 'info'"
                  :formatter="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d).*$/,
                        Math.floor(Number(value))
                      )
                  "
                  :max="9999"
                  :min="0"
                  :parser="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d).*$/,
                        Math.floor(Number(value))
                      )
                  "
                  :step="0.1"
                />
              </a-tooltip>
            </a-form-model-item>
            <a-form-model-item
              v-if="item.fleetChargingType === 2"
              label="单公里收费:"
              prop="fleetTyreKmCharge"
            >
              <a-tooltip placement="right">
                <template slot="title">
                  <span>请输入签订合同时的收费价格</span>
                </template>
                <a-input-number
                  v-model="item.fleetTyreKmCharge"
                  :disabled="item.formstatus === 'info'"
                  :formatter="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :max="1"
                  :min="0"
                  :parser="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :step="0.1"
                />
              </a-tooltip>
            </a-form-model-item>
            <a-form-model-item
              v-if="item.fleetChargingType === 3"
              label="单公里方量收费:"
              prop="fleetTyreKmCharge"
            >
              <a-tooltip placement="right">
                <template slot="title">
                  <span>请输入签订合同时的收费价格</span>
                </template>
                <a-input-number
                  v-model="item.fleetTyreKmCharge"
                  :disabled="item.formstatus === 'info'"
                  :formatter="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :max="1"
                  :min="0"
                  :parser="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :step="0.1"
                />
              </a-tooltip>
            </a-form-model-item>
            <a-form-model-item
              v-if="item.fleetChargingType === 2"
              label="单公里成本(预估)"
              prop="fleetCostCharge"
            >
              <a-tooltip placement="right">
                <template slot="title">
                  <span>请输入公司轮胎单公里成本价格，用于计算轮胎成本</span>
                </template>
                <a-input-number
                  v-model="item.fleetCostCharge"
                  :disabled="item.formstatus === 'info'"
                  :formatter="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :max="1"
                  :min="0"
                  :parser="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :step="0.1"
                />
              </a-tooltip>
            </a-form-model-item>
            <a-form-model-item
              v-if="item.fleetChargingType === 3"
              label="单公里方量成本(预估)"
              prop="fleetCostCharge"
            >
              <a-tooltip placement="right">
                <template slot="title">
                  <span>请输入公司轮胎单公里成本价格，用于计算轮胎成本</span>
                </template>
                <a-input-number
                  v-model="item.fleetCostCharge"
                  :disabled="item.formstatus === 'info'"
                  :formatter="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :max="1"
                  :min="0"
                  :parser="
                    value =>
                      `${value}`.replace(
                        /^(-)*(\d+)\.(\d\d\d\d\d).*$/,
                        Math.floor(Number(value) * 10000) / 10000
                      )
                  "
                  :step="0.1"
                />
              </a-tooltip>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div v-if="fleetAdd > 0 || fleetEdit > 0" class="addNewFleet">
          <a-divider />
          <div @click="addNewFleet">
            +继续添加该企业车队
          </div>
        </div>
        <template slot="footer">
          <div v-if="fleetAdd > 0 || fleetEdit > 0">
            <a-button v-if="fleetAdd > 0" key="back" @click="fleetReset()">
              重置
            </a-button>
            <a-button
              v-if="fleetAdd > 0"
              key="submit"
              type="primary"
              @click="submitCU()"
            >
              提交
            </a-button>
          </div>
          <div v-if="fleetInfo > 0 && fleetAdd === 0 && fleetEdit === 0">
            <a-button key="submit" type="primary" @click="cancelCU()">
              关闭
            </a-button>
          </div>
          <!-- <div v-if="fleetInfo > 0 && fleetAdd === 0 && fleetEdit === 0">
            <a-button
              key="back"
              :disabled="!crud.permission.edit"
              @click="editFleet()"
            >
              修改
            </a-button>
            <a-popconfirm
              placement="topRight"
              ok-text="删除"
              cancel-text="取消"
              @confirm="delFleet()"
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
          </div> -->
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import api from "@/api/system/account"
import engineerApi from "@/api/engineer"
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import mapDrag from "@/components/MapDrag"
import CRUD, { form, header, presenter } from "@crud/crud"
import AMap from "AMap"
import _ from "lodash"

import { uploadFile } from "@/utils/utils"

import sha1 from "sha1-file-web"

const defaultForm = {
  name: "",
  stationID: "",
  userID: "",
  enterpriseType: "",
  industryType: "",
  contactPerson: "",
  phoneNum: "",
  address: "",
  legalName: "",
  remark: "",
  licensePic: "",
  longitude: "",
  latitude: ""
}

export default {
  name: "Home",
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "企业信息",
      columns: [
        {
          title: "企业名称",
          dataIndex: "name"
        },
        {
          title: "企业类别",
          dataIndex: "enterpriseType"
        },
        {
          title: "行业类别",
          dataIndex: "industryType"
        },
        {
          title: "联系人姓名",
          dataIndex: "contactPerson"
        },
        {
          title: "联系人电话",
          dataIndex: "phoneNum"
        },
        {
          title: "所属服务站",
          dataIndex: "stationName"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...engineerApi },
      idField: "enterpriseID", // 设置每一条记录的唯一标失
      queryFun: (data, crud) => {
        if (data.code === 0) {
          for (const key in data.result) {
            if (key.includes("list")) {
              let res = data.result[key]
              for (let i = 0; i < res.length; i++) {
                let element = res[i]
                element["name"] = element.NAME
                delete element.NAME
              }
              crud.data = res
            }
          }
        }
        crud.page.total = data.result.count
        crud.resetDataStatus()
      }
    })
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入企业名称！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("企业名称只能输入中文！"))
      } else if (value.trim().length < 5 || value.trim().length > 20) {
        callback(new Error("企业名称只能5-20个字符！"))
      } else {
        callback()
      }
    }
    let checkPerson = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入联系人姓名！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("联系人姓名只能输入中文！"))
      } else if (value.trim().length < 2 || value.trim().length > 5) {
        callback(new Error("联系人姓名只能2-5个字符！"))
      } else {
        callback()
      }
    }
    let checkPending
    let checkContactPhone = (rule, value, callback) => {
      clearTimeout(checkPending)
      if (!value) {
        return callback(new Error("请输入手机号！"))
      }
      checkPending = setTimeout(() => {
        if (!/^[0-9]+$/.test(value)) {
          callback(new Error("请输入数字！"))
        } else {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error("请输入正确手机号"))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    let checkLegalName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入法人姓名！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("法人姓名只能输入中文！"))
      } else if (value.trim().length < 2 || value.trim().length > 5) {
        callback(new Error("法人姓名只能2-5个字符！"))
      } else {
        callback()
      }
    }

    let checkFleetName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入车队名称！"))
      }
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (reg.test(value)) {
        callback(new Error("车队名称只能输入中文、数字和字母！"))
      } else if (value.trim().length < 5 || value.trim().length > 20) {
        callback(new Error("车队名称只能5-20个字符！"))
      } else {
        callback()
      }
    }

    return {
      stationData: [],
      xsList: [],
      rules: {
        name: [{ required: true, validator: checkName, trigger: "blur" }],
        stationID: [
          { required: true, message: "请输入所属服务站", trigger: "change" }
        ],
        userID: [
          { required: false, message: "请选择销售人员", trigger: "change" }
        ],
        enterpriseType: [
          { required: true, message: "请输入企业类别", trigger: "change" }
        ],
        industryType: [
          { required: true, message: "请输入行业类别", trigger: "change" }
        ],
        contactPerson: [
          { required: true, validator: checkPerson, trigger: "blur" }
        ],
        phoneNum: [
          { required: true, validator: checkContactPhone, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入企业地址", trigger: "blur" }
        ],
        legalName: [
          { required: true, validator: checkLegalName, trigger: "blur" }
        ],
        remark: [
          { required: false, message: "请输入备注信息", trigger: "blur" },
          {
            min: 0,
            max: 50,
            message: "备注信息不超过50个字符",
            trigger: "blur"
          }
        ]
        // licensePic: [
        //   { required: true, message: "请上传营业执照", trigger: "blur" }
        // ]
      },
      companytypeList: [], // 企业类别列表
      industrytypeList: [], // 行业类别列表
      mapVisible: false,
      lng: "",
      lat: "",
      showType: "info",
      geocoder: null,

      fileList: [],

      fleetTitle: "新增车队",
      fleetAdd: 0,
      fleetEdit: 0,
      fleetInfo: 0,
      fleetForm: {
        fleetName: "",
        fleetPayType: 1,
        fleetChargingType: 2,
        fleetTyreKmCharge: "",
        fleetTyreMonthCharge: "",
        fleetCostCharge: "",
        fleetID: "",
        namePassed: "",
        formstatus: "add"
      },
      // focusform: "",
      fleetList: [],
      allEnterprise: [],
      copyAllEnterprise: [],
      selectEnterpriseID: "",
      copyFleet: null,
      fleetrules: {
        fleetName: [
          { required: true, validator: checkFleetName, trigger: "blur" }
        ],
        fleetPayType: [
          { required: true, message: "请选择付费方式", trigger: "change" }
        ],
        fleetChargingType: [
          { required: true, message: "请选择计费方式", trigger: "change" }
        ],
        // fleetTyreMonthCharge: [
        //   {
        //     required: true,
        //     validator: checkfleetTyreMonthCharge,
        //     trigger: "blur"
        //   }
        // ],
        // fleetTyreKmCharge: [
        //   { required: true, validator: checkfleetTyreKmCharge, trigger: "blur" }
        // ],
        fleetCostCharge: [
          { required: true, message: "请填写单公里成本", trigger: "blur" }
        ]
      },
      showBusiness: false,
      businessObj: {
        enterpriseInfo: {},
        fleetInfoList: []
      },
      activeRecord: {}
    }
  },
  watch: {
    "crud.status": {
      handler(newVal) {
        if (newVal.in === 0 && newVal.cu === 0) {
          this.lng = ""
          this.lat = ""
        }
      },
      deep: true
    }
  },
  components: { SearchOptions, Operations, Pagination, mapDrag },
  created() {
    let { code } = this.$route.meta

    console.log(code)

    this.crud.optShow.edit = false
    this.crud.optShow.del = false
    this.crud.permission = {
      download: true,
      edit: code.includes("修改企业"),
      del: code.includes("删除企业")
    }
    this.getStationList()
    this.getxsList()

    this.getDictionary("companytype")
    this.getDictionary("industrytype")

    let _this = this

    AMap.plugin("AMap.Geocoder", function() {
      _this.geocoder = new AMap.Geocoder({})
    })
  },
  methods: {
    // 获取服务站黎贝澳
    getStationList() {
      api.getStationList({}).then(res => {
        if (res.code === 0) {
          this.stationData = res.result.list
        }
      })
    },
    getxsList() {
      this.xsList = []
      // salesman.get({ pageSize: 9999, pageNum: 1 }).then(res => {
      //   if (res.code === 0) {
      //     this.xsList = res.result.list
      //   }
      // })
    },
    // 获取字典信息
    /**
     * companytype 企业类别  industrytype 行业类别
     */
    getDictionary(typeName) {
      engineerApi.getDictionary({ typeName }).then(res => {
        if (res.code === 0) {
          switch (typeName) {
            case "companytype":
              this.companytypeList = res.result.list
              break
            case "industrytype":
              this.industrytypeList = res.result.list
              break
            default:
              break
          }
        }
      })
    },
    // 展示详情
    toInfo(record) {
      this.fileList = [
        {
          uid: "-1",
          name: "营业执照.png",
          status: "done",
          url: this.form.licensePic,
          thumbUrl: this.form.licensePic
        }
      ]
      this.getLATLNG(record.address)
    },
    // 业务信息
    bussinessInfo(record) {
      this.showBusiness = true
      this.activeRecord = _.cloneDeep(record)
      engineerApi
        .getBusinessInfo({ enterpriseID: record.enterpriseID })
        .then(res => {
          if (res.code === 0) {
            res.result.enterpriseInfo.vehicleObject =
              res.result.enterpriseInfo.vehicleObject === null
                ? []
                : JSON.parse(res.result.enterpriseInfo.vehicleObject)

            let CT = 0
            let GC = 0
            let ZC = 0
            let TYRENUM = 0
            console.log(res.result.enterpriseInfo.vehicleObject)
            for (
              let i = 0;
              i < res.result.enterpriseInfo.vehicleObject.length;
              i++
            ) {
              const element = res.result.enterpriseInfo.vehicleObject[i]
              if (element.vehicleType === 1) {
                GC += element.vehicleAmount
              } else if (element.vehicleType === 2) {
                CT += element.vehicleAmount
              } else if (element.vehicleType === 3) {
                ZC += element.vehicleAmount
              }
              TYRENUM += element.vehicleInstallTyreAmount
            }
            res.result.enterpriseInfo["CT"] = CT
            res.result.enterpriseInfo["GC"] = GC
            res.result.enterpriseInfo["ZC"] = ZC
            res.result.enterpriseInfo["TYRENUM"] = TYRENUM

            for (let i = 0; i < res.result.fleetInfoList.length; i++) {
              const element = res.result.fleetInfoList[i]
              element.vehicleObject =
                element.vehicleObject === null
                  ? []
                  : JSON.parse(element.vehicleObject)
              element.tyreObject =
                element.tyreObject === null
                  ? []
                  : JSON.parse(element.tyreObject)
            }
            this.businessObj = res.result
            console.log(this.businessObj)
          }
        })
    },
    // 车队信息
    async vTeamInfo(record) {
      await this.getAllEnterprise()
      this.fleetTitle = "车队信息"
      this.fleetInfo = 1
      this.fleetList = []
      this.activeRecord = _.cloneDeep(record)
      engineerApi
        .getFleetList({ enterpriseID: record.enterpriseID })
        .then(res => {
          if (res.code === 0) {
            if (res.result.list.length) {
              this.selectEnterpriseID = res.result.list[0].enterpriseID
              let arr = res.result.list
              for (let index = 0; index < arr.length; index++) {
                const element = arr[index]
                element.namePassed = true
                element.formstatus = "info"
              }
              this.fleetList = arr
            }
          }
        })
    },
    getLocation(res) {
      if (this.showType !== "info") {
        if (res.status === "confirm") {
          this.form.longitude = res.data.lng
          this.form.latitude = res.data.lat
          this.form.address = res.data.address
        }
      }
    },
    showMap(it, type = "info") {
      if (type === "info") {
        this.lat = String(it.latitude)
        this.lng = String(it.longitude)
      }
      this.mapVisible = true
      this.showType = type
    },
    getLATLNG(address) {
      let _this = this
      _this.lng = ""
      _this.lat = ""
      this.geocoder.getLocation(address, function(status, result) {
        if (status === "complete" && result.info === "OK") {
          // result中对应详细地理坐标信息
          _this.lng = String(result.geocodes[0].location.lng)
          _this.lat = String(result.geocodes[0].location.lat)
        }
      })
    },
    beforeUpload(file) {
      if (this.fileList.length === 0) {
        this.fileList = [...this.fileList, file]
      }
      return false
    },
    async uploadChange(data) {
      if (data.fileList.length > 1) {
        data.fileList.pop()
      } else {
        if (data.fileList.length === 0) {
          this.form.licensePic = ""
        } else {
          const hash = await sha1(data.file)

          let fileObj = data.file
          let fileName = data.file.name
          let fileType = fileName.substr(fileName.lastIndexOf("."))

          const fileres = await uploadFile(hash, fileObj, fileType)

          if (fileres.res.status == 200 && fileres.res.statusCode == 200) {
            // this.fileList = [{ name: "营业执照照片", url: fileres.url }]
            this.form.licensePic = fileres.url
          }
        }
      }
    },
    async getAllEnterprise() {
      return new Promise(reslove => {
        engineerApi.get({}, false).then(res => {
          this.allEnterprise = res.result.list
          this.copyAllEnterprise = res.result.list
          this.selectEnterpriseID = this.allEnterprise[0].enterpriseID
          reslove()
        })
      })
    },
    handleSearch(value) {
      this.allEnterprise = this.copyAllEnterprise.filter(item => {
        return item.NAME.includes(value)
      })
    },
    // 新增车队
    addFleet() {
      this.getAllEnterprise()
      this.fleetList = [_.cloneDeep(this.fleetForm)]
      // this.focusform = 0
      this.fleetAdd = 1
      this.fleetInfo = 0
      this.fleetEdit = 0
      this.fleetTitle = "新增车队"
    },
    // 取消车队弹窗
    cancelCU() {
      this.fleetAdd = 0
      this.fleetInfo = 0
      this.fleetEdit = 0
      this.activeRecord = {}

      this.fleetReset("close")
    },

    // 提交
    submitCU() {
      let fleetlength = 0
      let passFleet = 0
      let namePassedNum = 0
      if (!this.selectEnterpriseID) {
        this.$message.error("请选择企业")
        return
      }
      for (const key in this.$refs) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.$refs.hasOwnProperty(key) && key.includes("fleetform")) {
          fleetlength++
          const element = this.$refs[key]
          element[0].validate(valid => {
            if (valid) {
              // let i = key.split("fleetform")[1]
              // if (
              //   this.fleetList[i].fleetChargingType === 2 &&
              //   !this.fleetList[i].fleetTyreKmCharge
              // ) {
              //   this.$message.error(
              //     `请填写“${this.fleetList[i].fleetName}”的单胎单公里收费`
              //   )
              //   return
              // }
              // if (
              //   this.fleetList[i].fleetChargingType === 1 &&
              //   !this.fleetList[i].fleetTyreMonthCharge
              // ) {
              //   this.$message.error(
              //     `请填写第“${this.fleetList[i].fleetName}”的单胎单月收费`
              //   )
              //   return
              // }
              passFleet++
            } else {
              return false
            }
          })
        }
      }
      for (let i = 0; i < this.fleetList.length; i++) {
        const element = this.fleetList[i]
        if (element.namePassed === false) {
          namePassedNum++
        }
      }
      if (fleetlength === passFleet && namePassedNum === 0) {
        let _fleetList = _.cloneDeep(this.fleetList)
        for (let i = 0; i < _fleetList.length; i++) {
          const element = _fleetList[i]
          delete element.namePassed
          delete element.formstatus
          element.enterpriseID = this.selectEnterpriseID
        }
        engineerApi.insertFleet({ fleetInfoList: _fleetList }).then(res => {
          if (res.code === 12) {
            this.cancelCU()
          }
        })
      }
    },
    editFleet(item, index) {
      if (this.copyFleet !== null) {
        this.$message.error("请先保存其他车队修改")
        return
      }
      this.copyFleet = _.cloneDeep(item)
      this.fleetList[index].formstatus = "edit"
    },
    delFleet(item, index) {
      if (item.fleetID) {
        if (!this.$route.meta.code.includes("删除车队")) {
          this.$message.error("当前帐号无删除车队权限")
          return
        }
        // 调接口
        engineerApi
          .deleteFleet({
            enterpriseID: item.enterpriseID,
            fleetID: item.fleetID
          })
          .then(res => {
            if (res.code === 16) {
              this.vTeamInfo(this.activeRecord)
            }
          })
      } else {
        this.fleetList.splice(index, 1)
      }
    },
    /**
     * type = 'reset' 给重置按钮用
     * type = 'close' 给关闭弹窗用
     */
    fleetReset(type = "reset") {
      this.fleetList = [_.cloneDeep(this.fleetForm)]
      this.copyFleet = null
      if (type !== "reset") {
        this.selectEnterpriseID = ""
        this.copyAllEnterprise = []
        this.allEnterprise = []
      }
      // this.focusform = ""
    },
    addNewFleet() {
      this.fleetList.push(_.cloneDeep(this.fleetForm))
    },
    // 检查车队名称是否
    async checkFleetName(item, index) {
      if (
        (item.namePassed === "" || item.namePassed === false) &&
        item.fleetName
      ) {
        let res = await engineerApi.getFleetListByParams({
          fleetName: item.fleetName
        })
        if (res.code === -22) {
          this.fleetList[index].namePassed = false
        } else {
          this.fleetList[index].namePassed = true
        }
      }
    },
    cancelFleet(index) {
      this.fleetList[index] = this.copyFleet
      this.fleetList[index].formstatus = "info"
    },
    saveFleet(index) {
      let data = _.cloneDeep(this.fleetList[index])
      delete data.namePassed
      delete data.formstatus
      delete data.insertTime
      delete data.isDelete
      delete data.updateTime
      engineerApi.updateFleet({ fleetInfo: data }).then(res => {
        if (res.code === 14) {
          this.fleetList[index].formstatus = "info"
        }
      })
    }
  }
}
</script>
