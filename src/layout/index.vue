<template>
  <a-layout>
    <Slider></Slider>
    <Main></Main>
    <page-setting></page-setting>
  </a-layout>
</template>
<script>
import Slider from "@/components/Slider"
import Main from "@/components/Main"
import PageSetting from "@/components/PageSetting"
export default {
  components: { Slider, Main, PageSetting },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped></style>
