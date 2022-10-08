<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="服务站">
              <a-input
                v-model="crud.query.name"
                placeholder="请输入服务站名称"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="联系人">
              <a-input
                v-model="crud.query.contactPerson"
                placeholder="请输入联系人名称"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="关联企业">
              <a-input
                v-model="crud.query.enterpriseName"
                placeholder="请输入关联企业名"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <template v-if="crud.advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="联系人电话">
                <a-input
                  v-model="crud.query.contactTel"
                  placeholder="请输入联系人电话"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="地 址">
                <a-input v-model="crud.query.address" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24"></a-col>
            <a-col :md="6" :sm="24"> </a-col>
          </template>
          <a-col :md="6" :sm="24">
            <SearchOptions style="width: 100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="服务站信息列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="stationID"
        >
          <template slot="enterprise" slot-scope="record">
            {{ enterpriseFilter(record.enterprise) }}
          </template>

          <template slot="insertTime" slot-scope="record">
            {{ insertTimeFilter(record.insertTime) }}
          </template>

          <template slot="operation" slot-scope="record">
            <a-button
              :disabled="!$route.meta.code.includes('获取服务站详情')"
              type="link"
              @click="
                toInfo(record)
                crud.toInfo(record)
              "
            >
              详情
            </a-button>
            |
            <a-button type="link" @click="showMap(record)">
              地图
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
          :wrapper-col="{ span: 18 }"
          labelAlign="left"
        >
          <a-form-model-item label="服务站名称" prop="name">
            <a-input
              v-model="form.name"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="联系人" prop="contactPerson">
            <a-input
              v-model="form.contactPerson"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="联系电话" prop="contactTel">
            <a-input
              v-model="form.contactTel"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="关联企业:" prop="enterpriseIDs">
            <a-select
              v-show="crud.status.cu > 0"
              v-model="form.enterpriseIDs"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :maxTagCount="3"
              mode="multiple"
              placeholder="请选择关联企业"
            >
              <a-select-option
                v-for="item in allUserEnterprises"
                :key="item.enterpriseID"
                :value="item.enterpriseID"
                >{{ item.name }}
              </a-select-option>
            </a-select>
            <div v-show="crud.status.cu === 0" style="padding-left:10px;">
              <div v-for="item in form.enterprise" :key="item.enterpriseID">
                {{ item.enterpriseName }}
              </div>
            </div>
          </a-form-model-item>

          <a-form-model-item label="省" prop="province">
            <a-input
              v-model="form.province"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="市" prop="city">
            <a-input
              v-model="form.city"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="区" prop="area">
            <a-input
              v-model="form.area"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item
            class="address-form-model-item"
            label="详细地址"
            prop="address"
          >
            <a-input v-model="form.address" :disabled="true" />
            <a-button
              v-if="crud.status.cu > 0"
              type="primary"
              @click="showMap({}, 'choose')"
              >选择地址
            </a-button>
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
              @click="submitCU()"
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
    </div>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { form, header, presenter } from "@crud/crud"
import mapDrag from "@/components/MapDrag"
import listApi from "@/api/station/list"

// 表格的填充字段
const defaultForm = {
  stationID: "",
  name: "",
  address: "",
  province: "",
  city: "",
  area: "",
  contactPerson: "",
  contactTel: "",
  longitude: "",
  latitude: "",
  enterprise: [],
  enterpriseIDs: []
}

export default {
  name: "Station",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      url: "/station/list",
      title: "服务站",
      columns: [
        {
          title: "服务站名称",
          dataIndex: "name"
        },
        {
          title: "联系人",
          dataIndex: "contactPerson"
        },
        {
          title: "联系电话",
          dataIndex: "contactTel"
        },
        {
          title: "关联企业",
          scopedSlots: { customRender: "enterprise" }
        },
        {
          title: "所在省",
          dataIndex: "province"
        },
        {
          title: "所在市",
          dataIndex: "city"
        },
        {
          title: "所在区",
          dataIndex: "area"
        },
        {
          title: "详细地址",
          dataIndex: "address"
        },
        {
          title: "创建日期",
          scopedSlots: { customRender: "insertTime" }
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...listApi },
      idField: "stationID" // 设置每一条记录的唯一标失
    })
  },
  filters: {},
  data() {
    let checkName = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (!value) {
        return callback(new Error("请输入服务站名称！"))
      }
      if (reg.test(value)) {
        callback(new Error("不能输入特殊字符！"))
      } else {
        if (value.trim().length < 5 || value.trim().length > 20) {
          callback(new Error("服务站名称只能5-20个字符"))
        } else {
          callback()
        }
      }
    }
    let checkPending
    const checkEnterpriseIDs = (rule, value, callback) => {
      if (!value || value.length === 0) {
        return callback(new Error("缺少关联企业ID"))
      }
      callback()
    }
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
    let checkContactPerson = (rule, value, callback) => {
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
    return {
      allUserEnterprises: [],
      stationData: [],
      stationIDMap: [],
      mapVisible: false,
      lng: "",
      lat: "",
      showType: "info",
      rules: {
        name: [{ required: true, validator: checkName, trigger: "blur" }],
        contactPerson: [
          { required: true, validator: checkContactPerson, trigger: "blur" }
        ],
        contactTel: [
          { required: true, validator: checkContactPhone, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请选择服务站地址", trigger: "blur" }
        ],
        enterpriseIDs: [
          {
            required: true,
            validator: checkEnterpriseIDs,
            message: "请选择关联企业",
            trigger: "blur"
          }
        ]
      }
    }
  },
  components: { SearchOptions, Operations, Pagination, mapDrag },
  created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta

    // 关闭下载功能
    this.crud.optShow.download = false
    this.crud.optShow.edit = false
    // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增服务站"),
      del: code.includes("删除服务站"),
      edit: code.includes("编辑服务站")
    }

    this.getUserStationEnterprise()
  },
  methods: {
    enterpriseFilter(enterprise) {
      return enterprise.map(item => item.enterpriseName).join(" | ")
    },
    insertTimeFilter(insertTime) {
      const insertTimeDate = new Date(insertTime)
      return (
        insertTimeDate.getFullYear() +
        "-" +
        (insertTimeDate.getMonth() + 1 >= 10
          ? insertTimeDate.getMonth() + 1
          : "0" + (insertTimeDate.getMonth() + 1)) +
        "-" +
        (insertTimeDate.getDay() >= 10
          ? insertTimeDate.getDay()
          : "0" + insertTimeDate.getDay()) +
        "  " +
        (insertTimeDate.getHours() >= 10
          ? insertTimeDate.getHours()
          : "0" + insertTimeDate.getHours()) +
        ":" +
        (insertTimeDate.getMinutes() >= 10
          ? insertTimeDate.getMinutes()
          : "0" + insertTimeDate.getMinutes()) +
        ":" +
        (insertTimeDate.getSeconds() >= 10
          ? insertTimeDate.getSeconds()
          : "0" + insertTimeDate.getSeconds())
      )
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
    async getUserStationEnterprise() {
      const res = await listApi.getUserStationEnterprise()
      if (res.code === 0 && res.result && res.result.length > 0) {
        this.allUserEnterprises = res.result
      }
    },
    toInfo(record) {
      console.log(`record : ${JSON.stringify(record)}`)
      this.form.enterpriseIDs = record.enterprise.map(item => item.enterpriseID)
    },
    submitCU() {
      this.crud.submitCU()
      this.getUserStationEnterprise()
    }
  }
}
</script>
