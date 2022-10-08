<template>
  <a-col class="search-col" :md="(!crud.advanced && grid) || 24" :sm="24">
    <span
      class="search-buttons"
      :style="
        (crud.advanced && { 'margin-bottom': '24px', overflow: 'hidden' }) || {}
      "
    >
      <a-button type="primary" :loading="crud.loading" @click="crud.toQuery()"
        >查询</a-button
      >
      <a-button
        v-if="crud.optShow.reset"
        style="margin-left: 8px"
        @click="crud.resetQuery()"
        >重置</a-button
      >
      <a
        @click="crud.toggleAdvanced()"
        v-show="toggleShowAdvance"
        style="margin-left: 8px"
      >
        {{ crud.advanced ? "收起" : "展开" }}
        <a-icon :type="crud.advanced ? 'up' : 'down'" />
      </a>
    </span>
  </a-col>
</template>
<script>
import { crud } from "@crud/crud"
export default {
  mixins: [crud()],
  props: {
    toggleShowAdvance: {
      type: Boolean,
      default() {
        return true
      }
    },
    grid: {
      type: Number,
      default() {
        return 8
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped></style>
