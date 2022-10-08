<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="商品名称">
              <a-input
                v-model="crud.query.goodsName"
                placeholder="商品名称模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="商品编号">
              <a-input
                v-model="crud.query.goodsNo"
                placeholder="商品编号模糊查询"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="商品分类">
              <a-select
                v-model="crud.query.categoryID"
                :filterOption="filterCategory"
                placeholder="请选择货品分类"
                show-search
              >
                <a-select-option
                  v-for="item in categoryMap"
                  :key="item.categoryID"
                  :value="item.categoryID"
                  >{{ item.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <SearchOptions :toggleShowAdvance="false" style="width: 100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="货品列表" />
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
          rowKey="goodsID"
        >
          <template slot="insertTime" slot-scope="record">
            {{ filterTime(record.insertTime) }}
          </template>

          <template slot="updateTime" slot-scope="record">
            {{ filterTime(record.updateTime) }}
          </template>

          <template slot="operation" slot-scope="record">
            <a-button
              :disabled="!$route.meta.code.includes('获取货品详情')"
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
          <a-form-model-item label="货品名称" prop="goodsName">
            <a-input
              v-model="form.goodsName"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>

          <a-form-model-item label="货品分类" prop="categoryID">
            <a-select
              v-model="form.categoryID"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :not-found-content="null"
              :show-arrow="false"
              placeholder="请选择货品分类"
              show-search
            >
              <a-select-option
                v-for="item in categoryMap"
                :key="item.categoryID"
                :value="item.categoryID"
                >{{ item.categoryName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="货品编号" prop="goodsNo">
            <a-input
              v-model="form.goodsNo"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="货品规格" prop="specification">
            <a-input
              v-model="form.specification"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              step="0.00001"
              suffix="吨"
              type="number"
            />
          </a-form-model-item>

          <a-form-model-item label="编织袋重/条" prop="bagWeight">
            <a-input
              v-model="form.bagWeight"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              max="1"
              min="0"
              placeholder="0"
              step="0.00001"
              suffix="吨"
              type="number"
            />
          </a-form-model-item>

          <a-form-model-item label="每吨扣Kg数" prop="deductWeight">
            <a-input
              v-model="form.deductWeight"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              max="1"
              min="0"
              placeholder="0"
              step="0.00001"
              suffix="吨"
              type="number"
            />
          </a-form-model-item>

          <a-form-model-item label="允许额外重量" prop="extraWeight">
            <a-input
              v-model="form.extraWeight"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              max="1"
              min="0"
              placeholder="0"
              step="0.00001"
              suffix="吨"
              type="number"
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
    </div>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { form, header, presenter } from "@crud/crud"
import Api from "@/api/station/goods"
import { UNIT_TYPE, UNIT_TYPE_MAP } from "@/config"
import { fullTimeFilter } from "@/utils/utils"

// 表格的填充字段
const defaultForm = {
  specification: 0,
  bagWeight: 0,
  deductWeight: 0,
  extraWeight: 0,

  goodsID: 0,
  categoryID: null,
  goodsNo: "",
  categoryName: "",
  goodsName: ""
}
export default {
  name: "Goods",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "货品",
      columns: [
        {
          title: "商品名称",
          width: 280,
          dataIndex: "goodsName"
        },
        {
          title: "商品编号",
          width: 180,
          dataIndex: "goodsNo"
        },
        {
          title: "分类",
          width: 200,
          dataIndex: "categoryName"
        },
        {
          title: "规格",
          width: 120,
          dataIndex: "specification"
        },
        {
          title: "编织袋重/条",
          width: 120,
          dataIndex: "bagWeight"
        },
        {
          title: "每吨扣Kg数(吨)",
          width: 150,
          dataIndex: "deductWeight"
        },
        {
          title: "允许额外可多配发重量",
          width: 180,
          dataIndex: "extraWeight"
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
      idField: "goodsID", // 设置每一条记录的唯一标失
      queryFun: (data, crud) => {
        if (
          data.code === 0 &&
          data.result &&
          data.result.list &&
          data.result.list.length &&
          data.result.list.length > 0
        ) {
          crud.data = data.result.list.map(item => {
            item["goodsName"] = item.name
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
    let checkGoodsName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入货品名称！"))
      }
      // eslint-disable-next-line no-useless-escape
      // let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      // if (reg.test(value)) {
      //   callback(new Error("货品不允许存在特殊字符"))
      // } else {
      callback()
      // }
    }
    let checkWeight = (rule, value, callback) => {
      // clearTimeout(checkPending)
      if (!value && value !== 0) {
        return callback(new Error("请输入正确重量！"))
      }
      // checkPending = setTimeout(() => {
      if (isNaN(parseFloat(value))) {
        callback(new Error("请输入数字！"))
      } else {
        if (parseFloat(value) > 1) {
          callback(new Error("请输入小于1吨的重量"))
        } else {
          callback()
        }
      }
      // }, 1000)
    }
    return {
      categoryMap: [],
      unitMap: UNIT_TYPE_MAP,

      rules: {
        goodsName: [
          { required: true, validator: checkGoodsName, trigger: "blur" }
        ],
        categoryID: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        specification: [
          { required: true, message: "请填写规格", trigger: "blur" }
        ],
        bagWeight: [
          { required: true, validator: checkWeight, trigger: "blur" }
        ],
        deductWeight: [
          { required: true, validator: checkWeight, trigger: "blur" }
        ],
        extraWeight: [
          { required: true, validator: checkWeight, trigger: "blur" }
        ]
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
      add: code.includes("新增货品"),
      del: code.includes("删除货品"),
      edit: code.includes("修改货品")
      // download: true
    }
    const categoryRes = await Api.getAllCategory()
    if (
      categoryRes.code === 0 &&
      categoryRes.result &&
      categoryRes.result.list &&
      categoryRes.result.list.length &&
      categoryRes.result.list.length > 0
    ) {
      this.categoryMap = categoryRes.result.list.map(item => ({
        categoryID: item.categoryID,
        categoryName: item.name
      }))
    }
  },
  methods: {
    filterType: type => (type && type > 0 ? UNIT_TYPE[type] : "-"),
    filterTime: timeStr => fullTimeFilter(timeStr),
    toInfo(record) {
      this.crud.toInfo(record)
    },
    filterCategory: function(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    }
  }
}
</script>
