<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
    <app-loader v-if="loading && !isFullScreen"></app-loader>
  </div>
</template>

<script>
// 全局配置中文组件
import zhCN from "ant-design-vue/es/locale/zh_CN"
import { mapGetters } from "vuex"
import AppLoader from "@/components/AppLoader"

export default {
  components: { AppLoader },
  data() {
    return {
      locale: zhCN,
      loading: true,
      isFullScreen: false
    }
  },
  computed: {
    ...mapGetters(["navigationmode", "loadMenus"])
  },
  watch: {
    $route: {
      handler(newVal) {
        if (
          newVal.path === "/login" ||
          newVal.path === "/reset" ||
          newVal.path === "/nopass"
        ) {
          this.isFullScreen = true
        } else {
          this.isFullScreen = false
        }
      },
      immediate: true,
      deep: true
    },
    loadMenus(newVal) {
      if (newVal) {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss">
#app {
  height: 100%;
}
</style>
