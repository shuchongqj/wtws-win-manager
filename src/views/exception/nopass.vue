<template>
  <a-result
    status="500"
    title="无权限"
    sub-title="抱歉, 您暂无访问权限，请联系管理员"
  >
    <template #extra>
      <a-button type="primary" @click="toLogin">
        重新登陆
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    toLogin() {
      this.$store.dispatch("LogOut", false)
    }
  }
}
</script>
