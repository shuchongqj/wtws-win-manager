<template>
  <div class="page-setting">
    <div
      :style="{ right: visible ? width + 'px' : 0 }"
      class="btn"
      @click="controlDrawer"
    >
      <a-icon :type="visible ? 'close' : 'setting'" />
    </div>
    <a-drawer
      :visible="visible"
      :width="width"
      class="own-drawer"
      placement="right"
      @close="onClose"
    >
      <div class="cell page-style">
        <div class="title">页面风格设置</div>
        <div class="list">
          <a-tooltip>
            <template slot="title">
              亮色菜单风格
            </template>
            <div class="item" @click="handlePageStyle('light')">
              <img alt="light" src="~@/assets/image/light-theme.svg" />
              <div
                v-if="navTheme !== 'dark'"
                class="setting-drawer-index-selectIcon"
              >
                <a-icon
                  :style="{ color: primaryColor }"
                  class="check-icon"
                  type="check"
                />
              </div>
            </div>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              暗色菜单风格
            </template>
            <div class="item" @click="handlePageStyle('dark')">
              <img alt="dark" src="~@/assets/image/dark-theme.svg" />
              <div
                v-if="navTheme === 'dark'"
                class="setting-drawer-index-selectIcon"
              >
                <a-icon
                  :style="{ color: primaryColor }"
                  class="check-icon"
                  type="check"
                />
              </div>
            </div>
          </a-tooltip>
        </div>
      </div>
      <div class="cell theme-color">
        <div class="title">主题颜色</div>
        <div class="list">
          <a-tooltip
            v-for="(item, index) in colorList"
            :key="index"
            placement="topLeft"
          >
            <template slot="title">
              <span>{{ item.key }}</span>
            </template>
            <div
              :style="{ background: item.color }"
              class="item"
              @click="changeColor(item.color)"
            >
              <a-icon
                v-if="item.color === primaryColor"
                class="check-icon"
                type="check"
              />
            </div>
          </a-tooltip>
        </div>
      </div>
      <div class="cell navigation-mode">
        <div class="title">固定布局</div>
        <div class="list">
          <a-switch v-model="isChecked" @change="onChange" />
          <span style="margin-left:20px;">固定侧边栏和导航栏</span>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { colorList, PageSetting, updateTheme } from "@/config"
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      width: 300,
      visible: false,
      colorList,
      primaryColor: PageSetting.primaryColor,
      navTheme: "light",
      isChecked: false
    }
  },
  computed: {
    ...mapGetters(["themecolor", "pagestyle", "navigationmode"])
  },
  watch: {
    themecolor: {
      handler(newVal) {
        this.primaryColor = newVal
        updateTheme(newVal)
      },
      immediate: true
    },
    pagestyle: {
      handler(newVal) {
        this.navTheme = newVal
      },
      immediate: true
    },
    navigationmode: {
      handler(newVal) {
        if (newVal === "fixed") {
          this.isChecked = true
        } else {
          this.isChecked = false
        }
      },
      immediate: true
    }
  },
  methods: {
    controlDrawer() {
      this.visible = !this.visible
    },
    onClose() {
      this.visible = false
    },
    changeColor(color) {
      if (this.primaryColor !== color) {
        this.$store.dispatch("ToggleThemeColor", color)
      }
    },
    handlePageStyle(theme) {
      this.$store.dispatch("TogglePageStyle", theme)
    },
    onChange(value) {
      if (value) {
        this.$store.dispatch("ToggleNavigationMode", "fixed")
      } else {
        this.$store.dispatch("ToggleNavigationMode", "static")
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-setting {
  .btn {
    position: fixed;
    top: 240px;
    right: 0;
    z-index: 9999;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    background: #1890ff;
    border-radius: 4px 0 0 4px;
    cursor: pointer;
    pointer-events: auto;
    transition: right 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }
}
</style>
<style lang="scss">
.own-drawer {
  .cell {
    .title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      line-height: 22px;
      font-weight: blod;
    }

    &.page-style {
      .list {
        display: flex;
        align-items: center;

        .item {
          position: relative;
          margin-right: 16px;
          border-radius: 2px;
          cursor: pointer;

          img {
            display: block;
            width: 48px;
          }

          .check-icon {
            position: absolute;
            right: 8px;
            bottom: 8px;
          }
        }
      }
    }

    &.theme-color {
      margin-top: 24px;
      overflow: hidden;

      .list {
        display: flex;
        align-items: center;

        .item {
          width: 20px;
          position: relative;
          height: 20px;
          margin-right: 8px;
          color: #fff;
          font-weight: bold;
          text-align: center;
          border-radius: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    &.navigation-mode {
      margin-top: 24px;
    }
  }
}
</style>
