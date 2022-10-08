<template>
  <a-layout-sider
    v-model="collapsed"
    :class="navigationmode === 'fixed' ? 'fix-slider' : ''"
    :collapsedWidth="collapsedWidth"
    :style="{
      overflow: 'auto',
      'min-height': '100vh',
      position: navigationmode,
      left: 0,
      background: pagestyle === 'dark' ? '#001529' : '#fff'
    }"
    :trigger="null"
    :width="sliderWidth"
    class="own-slider"
    collapsible
  >
    <div
      :class="[pagestyle === 'light' ? 'light' : '']"
      :style="{ height: height + 'px' }"
      class="logo"
    >
      <router-link to="/">
        <div class="imgbox">
          <img alt="" src="~@/assets/image/logo-index.png" srcset="" />
        </div>
        <h1
          v-if="!collapsed"
          :style="{ color: pagestyle === 'light' ? themecolor : '#fff' }"
        >
          川金诺称重后台
        </h1>
      </router-link>
    </div>
    <Menu
      :style="{ height: `calc(100% - ${height}px)` }"
      :theme="pagestyle"
    ></Menu>
  </a-layout-sider>
</template>
<script>
import Menu from "../Menu"
import eventBus from "@/bus"
import { PageSetting } from "@/config"
import { mapGetters } from "vuex"

export default {
  components: { Menu },
  data() {
    return {
      collapsed: false,
      height: PageSetting.headerHeight,
      collapsedWidth: PageSetting.collapsedWidth,
      sliderWidth: PageSetting.sliderWidth
    }
  },
  computed: {
    ...mapGetters(["pagestyle", "navigationmode", "themecolor"])
  },
  beforeMount() {
    eventBus.$on("collapsed", val => {
      this.$nextTick(() => {
        this.collapsed = val
      })
    })
  },
  watch: {
    navigationmode(newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style lang="scss" scoped>
.own-slider {
  min-height: 100vh;
  overflow-x: hidden !important;

  &.fix-slider {
    height: 100vh;
  }

  .logo {
    width: 100%;
    height: 64px;
    display: flex;
    position: relative;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 20px;

    /deep/ a {
      width: auto;
      display: flex;
      align-items: center;
    }

    .imgbox {
      display: inline-block;
      border-radius: 50%;

      img {
        display: inline-block;
        width: 40px;
      }

      position: relative;
      transition-duration: 0.5s;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        left: -665px;
        top: -460px;
        width: 200px;
        height: 15px;
        background-color: rgba(255, 255, 255, 0.5);
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
        -webkit-animation: searchLights 1.5s ease-in 1.5s infinite;
        -o-animation: searchLights 1.5s ease-in 1.5s infinite;
        animation: searchLights 1.5s ease-in 1.5s infinite;
      }
    }

    h1 {
      color: #fff;
      margin-left: 15px;
      font-size: 16px;
      vertical-align: middle;
      width: 120px;
    }

    &.light {
      border: 1px solid #efefef;
      border-top: none;
      border-left: none;
    }
  }

  @-webkit-keyframes searchLights {
    0% {
      left: -100px;
      top: 0;
    }
    to {
      left: 120px;
      top: 100px;
    }
  }
  @-o-keyframes searchLights {
    0% {
      left: -100px;
      top: 0;
    }
    to {
      left: 120px;
      top: 100px;
    }
  }
  @-moz-keyframes searchLights {
    0% {
      left: -100px;
      top: 0;
    }
    to {
      left: 120px;
      top: 100px;
    }
  }
  @keyframes searchLights {
    0% {
      left: -100px;
      top: 0;
    }
    to {
      left: 120px;
      top: 100px;
    }
  }

  /deep/ .ant-layout-sider-children {
    .ant-menu {
      overflow-y: auto;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
  }
}
</style>
