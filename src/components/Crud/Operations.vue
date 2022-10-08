<template>
  <div class="opreations">
    <div class="_left">
      <h3>{{ tableName }}</h3>
    </div>
    <div class="_right">
      <div class="btns">
        <slot name="left"></slot>
        <a-button
          v-permission="crud.permission.add"
          v-if="crud.optShow.add"
          @click="crud.toAdd"
          type="primary"
          icon="plus"
        >
          新增
        </a-button>
        <a-button
          v-if="crud.optShow.edit"
          v-permission="crud.permission.edit"
          :disabled="crud.selections.length !== 1"
          @click="crud.toEdit(crud.selections[0])"
          type="dashed"
          icon="edit"
        >
          修改
        </a-button>
        <a-button
          v-if="crud.optShow.del"
          v-permission="crud.permission.del"
          :loading="crud.delAllLoading"
          :disabled="crud.selections.length === 0"
          @click="toDelete(crud.selections)"
          type="danger"
          icon="delete"
        >
          删除
        </a-button>
        <!-- <a-dropdown
          v-permission="crud.permission.download"
          v-if="crud.optShow.download"
        > -->
        <a-button
          v-permission="crud.permission.download"
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          @click="crud.doAllExport"
          type="link"
          icon="download"
        >
          导出
        </a-button>
        <!-- <a-menu slot="overlay">
            <a-menu-item @click="crud.doExport">导出选中数据</a-menu-item>
            <a-menu-item @click="crud.doAllExport">全部导出</a-menu-item>
          </a-menu>
        </a-dropdown> -->
      </div>
      <div class="ops">
        <a-tooltip @click="crud.resetQuery()" placement="top">
          <template slot="title">
            <div>刷新</div>
          </template>
          <a-icon type="reload" />
        </a-tooltip>
        <!-- <a-tooltip placement="top">
          <template slot="title">
            <span>列设置</span>
          </template>
          <a-icon type="setting" />
        </a-tooltip> -->
      </div>
    </div>
  </div>
</template>
<script>
import { crud } from "@crud/crud"
export default {
  mixins: [crud()],
  props: ["tableName"],
  data() {
    return {}
  },
  methods: {
    toDelete(datas) {
      let _this = this
      this.$confirm({
        title: "提示",
        content: `确认删除选中的${datas.length}条数据?`,
        onOk() {
          _this.crud.delAllLoading = true
          _this.crud.doDelete(datas)
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.opreations {
  display: flex;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  line-height: 64px;
  ._left {
    display: flex;
    justify-content: flex-start;
    font-weight: bold;
  }
  ._right {
    display: flex;
    justify-content: flex-end;
    .btns {
      display: flex;
      align-items: center;
      margin-right: 20px;
      & > * {
        margin-right: 15px;
        &:last-child {
          margin-right: 20px;
        }
      }
      position: relative;
      &::after {
        display: block;
        content: "";
        width: 1px;
        height: 30px;
        background-color: #efefef;
        top: 50%;
        transform: translateX(-50%);
        right: -20px;
      }
    }
    .ops {
      display: flex;
      align-items: center;
      & > * {
        cursor: pointer;
        margin-right: 15px;
      }
    }
  }
}
</style>
