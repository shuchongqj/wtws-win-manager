<template>
  <div class="own-pagination">
    <div>
      <slot name="left" />
    </div>
    <a-pagination
      :total="page.total"
      :pageSize.sync="page.size"
      v-model="page.page"
      :show-total="total => `共有 ${total} 条记录`"
      :pageSizeOptions="['10', '20', '50', '100']"
      show-size-changer
      show-quick-jumper
      @change="crud.pageChangeHandler"
      @showSizeChange="crud.sizeChangeHandler"
    />
  </div>
</template>
<script>
import { pagination } from "@crud/crud"
export default {
  mixins: [pagination()],
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.own-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
}
</style>
