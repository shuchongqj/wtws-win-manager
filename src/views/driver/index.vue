<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="司机车牌号">
              <a-input
                v-model="crud.query.vehicleNumber"
                placeholder="车牌号模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="司机姓名">
              <a-input
                v-model="crud.query.driverName"
                placeholder="司机姓名模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="司机身份证">
              <a-input
                v-model="crud.query.idCardNo"
                placeholder="司机身份证模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <template v-if="crud.advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="司机手机号">
                <a-input
                  v-model="crud.query.tel"
                  placeholder="手机号模糊查询"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="银行卡开户人">
                <a-input
                  v-model="crud.query.bankUserName"
                  placeholder="开户人姓名模糊查询"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="银行卡号">
                <a-input
                  v-model="crud.query.bankNo"
                  placeholder="银行卡号模糊查询"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24"></a-col>
          </template>

          <a-col :md="6" :sm="24">
            <SearchOptions :toggleShowAdvance="true" style="width: 100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="司机列表" />
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
          rowKey="driverID"
        >
          <template slot="driverAccount" slot-scope="record">
            <div :style="{ color: record.driverAccount ? 'blue' : 'red' }">
              {{ record.driverAccount ? "是" : "否" }}
            </div>
          </template>

          <template slot="insertTime" slot-scope="record">
            {{ filterTime(record.insertTime) }}
          </template>

          <template slot="updateTime" slot-scope="record">
            {{ filterTime(record.updateTime) }}
          </template>

          <template slot="operation" slot-scope="record">
            <a-button
              :disabled="!$route.meta.code.includes('获取司机详情')"
              type="link"
              @click="toInfo(record)"
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
      <a-modal
        :afterClose="
          () => {
            updateUserInfo = false
            updateDriverInfo = false
            crud.refresh()
          }
        "
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
          <a-form-model-item label="司机登录账号" prop="driverAccount">
            <a-input
              v-model="form.driverAccount"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="
                updateUserInfo = true
                updateDriverInfo = true
              "
            />
          </a-form-model-item>

          <a-form-model-item label="工号" prop="workNo">
            <a-input
              v-model="form.workNo"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="
                updateUserInfo = true
                updateDriverInfo = true
              "
            />
          </a-form-model-item>

          <a-form-model-item label="车牌号" prop="vehicleNumber">
            <a-input
              v-model="form.vehicleNumber"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateDriverInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="司机姓名" prop="driverName">
            <a-input
              v-model="form.driverName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="
                updateUserInfo = true
                updateDriverInfo = true
              "
            />
          </a-form-model-item>

          <a-form-model-item label="司机手机号" prop="tel">
            <a-input
              v-model="form.tel"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="
                updateUserInfo = true
                updateDriverInfo = true
              "
            />
          </a-form-model-item>

          <a-form-model-item label="性别:" prop="gender">
            <a-radio-group
              v-model="form.gender"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateUserInfo = true"
            >
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
              <a-radio :value="3">未知</a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="司机身份证号" prop="idCardNo">
            <a-input
              v-model="form.idCardNo"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateDriverInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="生日:" prop="birthDate">
            <a-date-picker
              v-model="form.birthDate"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateUserInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="邮箱:" prop="email">
            <a-input
              v-model="form.email"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateUserInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="上路限总重" prop="limitTotalLoad">
            <a-input
              v-model="form.limitTotalLoad"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              placeholder="0"
              step="0.01"
              suffix="吨"
              type="number"
              @change="updateDriverInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="载重+车身总长" prop="length">
            <a-input
              v-model="form.length"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateDriverInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="银行卡开户人" prop="bankUserName">
            <a-input
              v-model="form.bankUserName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateDriverInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="所属银行" prop="bankName">
            <a-input
              v-model="form.bankName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateDriverInfo = true"
            />
          </a-form-model-item>

          <a-form-model-item label="银行卡" prop="bankNo">
            <a-input
              v-model="form.bankNo"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="updateDriverInfo = true"
            />
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
              @click="submit()"
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
import Api from "@/api/driver/index"
import { UNIT_TYPE_MAP } from "@/config"
import { fullTimeFilter } from "@/utils/utils"

// 表格的填充字段
const defaultForm = {
  driverID: null,

  workNo: "",
  driverAccount: "",
  driverName: "",
  vehicleNumber: "",
  tel: "",

  updateUserInfo: false,
  updateDriverInfo: false,

  driverPass: "",

  gender: 3,
  idCardNo: "",
  email: "",
  birthDate: "",

  limitTotalLoad: 0,
  length: "",

  bankUserName: "",
  bankName: "",
  bankNo: ""
}
export default {
  name: "Driver",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "司机",
      columns: [
        {
          title: "车牌号",
          width: 120,
          dataIndex: "vehicleNumber"
        },
        {
          title: "已配置账号",
          width: 120,
          scopedSlots: { customRender: "driverAccount" }
        },

        {
          title: "司机姓名",
          width: 110,
          dataIndex: "driverName"
        },
        {
          title: "身份证号",
          width: 190,
          dataIndex: "idCardNo"
        },
        {
          title: "手机号",
          width: 120,
          dataIndex: "tel"
        },
        {
          title: "上路限总重",
          width: 110,
          dataIndex: "limitTotalLoad"
        },
        {
          title: "载重(吨)+车身总长(米)",
          width: 180,
          dataIndex: "length"
        },

        {
          title: "银行卡开户人",
          width: 120,
          dataIndex: "bankUserName"
        },

        {
          title: "所属银行",
          width: 130,
          dataIndex: "bankName"
        },

        {
          title: "银行卡",
          width: 180,
          dataIndex: "bankNo"
        },

        {
          title: "创建日期",
          scopedSlots: { customRender: "insertTime" }
        },
        {
          title: "近期修改日期",
          scopedSlots: { customRender: "updateTime" }
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...Api },
      idField: "driverID", // 设置每一条记录的唯一标失
      queryFun: (data, crud) => {
        if (
          data.code === 0 &&
          data.result &&
          data.result.list &&
          data.result.list.length &&
          data.result.list.length > 0
        ) {
          crud.data = data.result.list.map(item => {
            item["driverAccount"] = item.loginName
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
    let checkVehicleNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入车牌号！"))
      }
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (reg.test(value)) {
        callback(new Error("车牌号只能输入中文、数字和字母！"))
      } else if (value.trim().length < 3 || value.trim().length > 20) {
        callback(new Error("车牌号只能3-20个字符！"))
      } else {
        callback()
      }
    }

    let checkTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入联系人手机号！"))
      }
      if (!/^[0-9]+$/.test(value)) {
        callback(new Error("请输入数字！"))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的联系人手机号"))
        } else {
          callback()
        }
      }
    }

    const checkDriverName = (rule, value, callback) => {
      console.log(`checkContactPhone value : ${value}`)
      if (!value) {
        return callback(new Error("请输入联系人姓名！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("联系人姓名只能输入中文！"))
      } else if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("联系人姓名只能2-10个字符！"))
      } else {
        callback()
      }
    }

    return {
      categoryMap: [],
      unitMap: UNIT_TYPE_MAP,
      updateUserInfo: false,
      updateDriverInfo: false,
      rules: {
        vehicleNumber: [
          { required: true, validator: checkVehicleNumber, trigger: "blur" }
        ],
        driverName: [
          { required: true, validator: checkDriverName, trigger: "blur" }
        ],
        tel: [{ required: true, validator: checkTel, trigger: "blur" }]
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
    // this.crud.optShow.download = false
    this.crud.optShow.edit = false
    // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增司机"),
      del: code.includes("删除司机"),
      edit: code.includes("修改司机")
    }
  },
  methods: {
    filterTime: timeStr => fullTimeFilter(timeStr),
    toInfo(record) {
      this.form = { ...record }
      this.crud.toInfo(record)
    },
    filterCategory: function(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    submit: async function() {
      if (
        (this.form.workNo && !this.form.driverAccount) ||
        (!this.form.workNo && this.form.driverAccount)
      ) {
        return this.$message.info("账号和工号必须同时存在")
      }

      console.log(`this.updateUserInfo : ${this.updateUserInfo}`)
      const that = this

      if (this.updateUserInfo || this.updateDriverInfo) {
        this.form.updateUserInfo = this.updateUserInfo
        this.form.updateDriverInfo = this.updateDriverInfo
        await Api.edit({ ...that.form })
        this.form.updateUserInfo = false
        this.form.updateDriverInfo = false
        this.updateUserInfo = false
        this.updateDriverInfo = false
      } else {
        this.form.updateUserInfo = false
        this.form.updateDriverInfo = false
        this.updateUserInfo = false
        this.updateDriverInfo = false
      }
      that.crud.cancelCU("uptoinfo")
    }
  }
}
</script>
