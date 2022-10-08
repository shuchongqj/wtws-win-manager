<template>
  <a-layout
    style="transition: all 0.2s;"
    :style="{
      'padding-left': navigationmode === 'fixed' ? paddingLeft + 'px' : 0
    }"
  >
    <div
      v-if="navigationmode === 'fixed'"
      style="100%"
      :style="{ height: headerHeight + 'px' }"
    ></div>
    <Header ref="header"></Header>
    <a-layout-content
      :style="{
        margin: '16px',
        minHeight: `calc(100vh - ${headerHeight + 32}px)`
      }"
    >
      <transition name="fade-transform" mode="out-in">
        <router-view></router-view>
      </transition>
    </a-layout-content>
  </a-layout>
</template>
<script>
import Header from "@/components/Header"
import eventBus from "@/bus"
import { PageSetting } from "@/config"
import { mapGetters } from "vuex"
// import AppLoader from "@/components/AppLoader"

export default {
  // AppLoader
  components: { Header },
  data() {
    return {
      paddingLeft: PageSetting.collapsedWidth,
      headerHeight: PageSetting.headerHeight
    }
  },
  computed: {
    ...mapGetters(["navigationmode", "loadMenus"])
  },
  mounted() {
    this.paddingLeft = this.$refs.header.collapsed
      ? PageSetting.collapsedWidth
      : PageSetting.sliderWidth
    this.$nextTick(() => {
      eventBus.$on("collapsed", val => {
        if (val) {
          this.paddingLeft = PageSetting.collapsedWidth
        } else {
          this.paddingLeft = PageSetting.sliderWidth
        }
      })
    })
  }
}
</script>
