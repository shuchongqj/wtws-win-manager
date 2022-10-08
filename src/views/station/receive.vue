<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="收货单元名称">
              <a-input
                v-model="crud.query.receiveName"
                placeholder="名称模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="联系人名称">
              <a-input
                v-model="crud.query.contactName"
                placeholder="联系人名字模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="联系电话">
              <a-input
                v-model="crud.query.tel"
                placeholder="联系电话模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <template v-if="crud.advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="地址">
                <a-input
                  v-model="crud.query.address"
                  placeholder="地址信息模糊查询"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="类 型">
                <a-select
                  v-model="crud.query.type"
                  placeholder="请选择类型"
                  show-search
                >
                  <a-select-option
                    v-for="item in unitMap"
                    :key="item.key"
                    :value="item.key"
                    >{{ item.value }}
                  </a-select-option>
                </a-select>
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
      <Operations tableName="收货单元列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="receiveID"
        >
          <template slot="type" slot-scope="record">
            <div :style="{ color: record.type === 1 ? 'green' : 'blue' }">
              {{ filterType(record.type) }}
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
              :disabled="!$route.meta.code.includes('获取收货单位详情')"
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
          <a-form-model-item label="收货单位名称" prop="receiveName">
            <a-input
              v-model="form.receiveName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="联系人" prop="contactName">
            <a-input
              v-model="form.contactName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="联系电话" prop="tel">
            <a-input
              v-model="form.tel"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="类型" prop="type">
            <a-select
              v-model="form.type"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :not-found-content="null"
              :show-arrow="false"
              placeholder="请选择"
              show-search
            >
              <a-select-option
                v-for="item in unitMap"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}
              </a-select-option>
            </a-select>
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
        <map-drag
          :lat.sync="lat"
          :lng.sync="lng"
          :mapVisible.sync="mapVisible"
          :type="showType"
          @getLocation="getLocation"
        ></map-drag>
      </a-modal>
    </div>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { form, header, presenter } from "@crud/crud"
import Api from "@/api/station/receive"
import { UNIT_TYPE, UNIT_TYPE_MAP } from "@/config"
import { fullTimeFilter } from "@/utils/utils"
import mapDrag from "@/components/MapDrag"

// 表格的填充字段
const defaultForm = {
  contactName: "",
  receiveName: "",
  tel: "",
  type: null
}
export default {
  name: "Receive",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "收货单元",
      columns: [
        {
          title: "名称",
          dataIndex: "receiveName"
        },
        {
          title: "联系电话",
          dataIndex: "tel"
        },
        {
          title: "联系姓名",
          dataIndex: "contactName"
        },
        {
          title: "地址",
          dataIndex: "address"
        },
        {
          title: "类型",
          scopedSlots: { customRender: "type" }
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
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...Api },
      idField: "receiveID", // 设置每一条记录的唯一标失
      queryFun: (data, crud) => {
        if (
          data.code === 0 &&
          data.result &&
          data.result.list &&
          data.result.list.length &&
          data.result.list.length > 0
        ) {
          crud.data = data.result.list.map(item => {
            item["receiveName"] = item.name
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
    let checkReceiveName = (rule, value, callback) => {
      console.log(`checkReceiveName value : ${value}`)
      if (!value) {
        return callback(new Error("请输入收货单位名称！"))
      }
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (reg.test(value)) {
        callback(new Error("收货单位不允许存在特殊字符"))
      } else {
        callback()
      }
    }
    let checkPending
    let checkContactPhone = (rule, value, callback) => {
      console.log(`checkContactPhone value : ${value}`)
      clearTimeout(checkPending)
      if (!value) {
        return callback(new Error("请输入联系人手机号！"))
      }
      checkPending = setTimeout(() => {
        if (!/^[0-9]+$/.test(value)) {
          callback(new Error("请输入数字！"))
        } else {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error("请输入正确的联系人手机号"))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    let checkContactPerson = (rule, value, callback) => {
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
      mapVisible: false,
      lng: "",
      lat: "",
      showType: "info",
      stationData: [],
      unitMap: UNIT_TYPE_MAP,
      rules: {
        receiveName: [
          { required: true, validator: checkReceiveName, trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        contactName: [
          { required: true, validator: checkContactPerson, trigger: "blur" }
        ],
        tel: [{ required: true, validator: checkContactPhone, trigger: "blur" }]
      }
    }
  },
  components: { SearchOptions, Operations, Pagination, mapDrag },
  created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta
    console.log(code)
    // 关闭下载功能
    // this.crud.optShow.download = false
    this.crud.optShow.edit = false
    // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增收货单位"),
      del: code.includes("删除收货单位"),
      edit: code.includes("修改收货单位")
      // download: true
    }
  },
  methods: {
    filterType: type => (type && type > 0 ? UNIT_TYPE[type] : "-"),
    filterTime: timeStr => fullTimeFilter(timeStr),
    showMap(it, type = "info") {
      if (type === "info") {
        this.lat = String(it.latitude)
        this.lng = String(it.longitude)
      }
      this.mapVisible = true
      this.showType = type
    },
    getLocation(res) {
      if (this.showType !== "info") {
        if (res.status === "confirm") {
          this.form.longitude = res.data.lng
          this.form.latitude = res.data.lat
          this.form.address = res.data.address
        }
      }
    }
  }
}
</script>
