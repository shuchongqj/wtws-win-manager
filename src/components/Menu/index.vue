<template>
  <a-menu
    @click="menuclick"
    :theme="theme"
    mode="inline"
    :default-selected-keys="defaultSelectedKeys"
  >
    <template v-for="item in permission_routers">
      <a-menu-item
        v-if="
          (!item.hasOwnProperty('children') || item.children.length === 1) &&
            !item.hidden &&
            item.children[0].path === ''
        "
        :key="item.path"
      >
        <a-icon :type="item.icon" />
        <span>{{ item.name }}</span>
      </a-menu-item>
      <sub-menu
        v-if="
          (item.children && item.children.length > 1 && !item.hidden) ||
            (item.children &&
              item.children.length === 1 &&
              item.children[0].path !== '' &&
              !item.hidden)
        "
        :key="item.path"
        :menu-info="item"
      />
    </template>
  </a-menu>
</template>
<script>
import { mapGetters } from "vuex"
import SubMenu from "./submenu"

export default {
  props: {
    theme: {
      type: String,
      default() {
        return "dark"
      }
    }
  },
  components: {
    SubMenu
  },
  computed: {
    ...mapGetters(["permission_routers"])
  },
  watch: {
    $route: {
      handler(newVal) {
        this.defaultSelectedKeys = [newVal.fullPath]
      },
      deep: true,
      immediate: true
    },
    permission_routers: {
      handler() {},
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      defaultSelectedKeys: []
    }
  },
  methods: {
    menuclick({ key }) {
      this.defaultSelectedKeys = [key]
      this.$router.push(key)
    }
  }
}
</script>
<style lang="scss" scoped></style>
