<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="装卸地点名称">
              <a-input
                v-model="crud.query.cargotoName"
                placeholder="地点名称模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="装卸地点编号">
              <a-input
                v-model="crud.query.code"
                placeholder="地点编号模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24"></a-col>

          <a-col :md="6" :sm="24">
            <SearchOptions :toggleShowAdvance="false" style="width: 100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="装卸货地点列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="cargotoID"
        >
          <template slot="insertTime" slot-scope="record">
            {{ filterTime(record.insertTime) }}
          </template>

          <template slot="updateTime" slot-scope="record">
            {{ filterTime(record.updateTime) }}
          </template>

          <template slot="operation" slot-scope="record">
            <a-button
              :disabled="!$route.meta.code.includes('获取装货地点详情')"
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
          <a-form-model-item label="装卸货地点名称" prop="cargotoName">
            <a-input
              v-model="form.cargotoName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="dataChanged = true"
            />
          </a-form-model-item>

          <a-form-model-item label="装卸地点Code" prop="code">
            <a-input
              v-model="form.code"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              @change="dataChanged = true"
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
              @click="toSubmit()"
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
import Api from "@/api/station/cargoto"
import { UNIT_TYPE } from "@/config"
import { fullTimeFilter } from "@/utils/utils"

// 表格的填充字段
const defaultForm = {
  cargotoName: "",
  code: ""
}
export default {
  name: "Cargoto",
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "装卸货地点",
      columns: [
        {
          title: "装卸地名称",
          width: 280,
          dataIndex: "cargotoName"
        },
        {
          title: "装卸地Code",
          width: 280,
          dataIndex: "code"
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
      idField: "cargotoID" // 设置每一条记录的唯一标失
    })
  },
  filters: {},
  data() {
    let checkCargotoName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入装卸货地点名称！"))
      }
      callback()
    }

    const checkCargotoCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入装卸货地点Code！"))
      }

      if (!/^[0-9a-zA-Z]+$/.test(value)) {
        return callback(new Error("装卸货地点只允许输入数字/字母"))
      }

      callback()
    }

    return {
      dataChanged: false,
      rules: {
        cargotoName: [
          { required: true, validator: checkCargotoName, trigger: "blur" }
        ],
        code: [{ required: true, validator: checkCargotoCode, trigger: "blur" }]
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
      add: code.includes("新增装卸货地点"),
      del: code.includes("删除装卸货地点"),
      edit: code.includes("修改装卸货地点")
    }
  },
  methods: {
    filterType: type => (type && type > 0 ? UNIT_TYPE[type] : "-"),
    filterTime: timeStr => fullTimeFilter(timeStr),
    toInfo(record) {
      this.crud.toInfo(record)
    },
    toSubmit: function() {
      if (this.dataChanged) {
        this.crud.submitCU()
        this.dataChanged = false
      }
    }
  }
}
</script>
