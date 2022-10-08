<template>
  <a-layout-header
    :style="{
      position: navigationmode,
      zIndex: 1,
      width: navigationmode === 'fixed' ? headerWidth : '100%',
      height: headerHeight + 'px'
    }"
    class="own-header"
  >
    <a-icon
      :type="collapsed ? 'menu-unfold' : 'menu-fold'"
      class="trigger"
      @click="() => (collapsed = !collapsed)"
    />
    <div>
      <a-dropdown :trigger="['click']">
        <div>
          {{ timeFix() }}，
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            {{ user.displayName || user.loginName || "用户名" }}
            <a-icon type="down" />
          </a>
        </div>
        <a-menu slot="overlay">
          <a-menu-item @click="resetPwd">
            修改密码
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item @click="logout">
            退出登录
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>

    <!-- 修改密码 -->
    <a-modal
      :confirm-loading="confirmLoading"
      :visible="visible"
      title="修改密码"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form-model
        ref="form"
        :label-col="{ span: 5 }"
        :model="form"
        :rules="rules"
        :wrapper-col="{ span: 19 }"
        labelAlign="left"
      >
        <a-form-model-item ref="oldPwd" label="旧密码" prop="oldPwd">
          <a-input
            v-model="form.oldPwd"
            allow-clear
            type="password"
            @blur="
              () => {
                $refs.oldPwd.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="newPwd" label="新密码" prop="newPwd">
          <a-input
            v-model="form.newPwd"
            allow-clear
            type="password"
            @blur="
              () => {
                $refs.newPwd.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="rePwd" label="确认密码" prop="rePwd">
          <a-input
            v-model="form.rePwd"
            allow-clear
            type="password"
            @blur="
              () => {
                $refs.rePwd.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-layout-header>
</template>
<script>
import md5 from "js-md5" // 使用md5加密密码
import { updatepwd } from "@/api/user"
import { timeFix } from "@/utils/utils"
import eventBus from "@/bus"
import { PageSetting } from "@/config"
import { mapGetters } from "vuex"

export default {
  data() {
    // 验证确认密码
    let validateRepasswword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次确认密码"))
      } else if (value !== this.form.newPwd) {
        callback(new Error("两次密码不一致"))
      } else {
        callback()
      }
    }
    // 验证新密码输入
    let validatePasswword = (rule, value, callback) => {
      // 新密码正则验证
      let special = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)
      if (value.trim() === "") {
        this.popoverVisible = true
        callback(new Error("请输入密码"))
      } else if (value.includes(" ")) {
        this.popoverVisible = true
        callback(new Error("不能包含空格"))
      } else if (!special.test(value)) {
        this.popoverVisible = true
        callback(new Error("由数字和字母组成，不能包含特殊字符"))
      } else if (value.length < 6 || value.length > 11) {
        this.popoverVisible = true
        callback(new Error("长度为6-11个字符"))
      } else {
        this.popoverVisible = false
        callback()
      }
    }
    return {
      collapsed: false,
      timeFix,
      headerHeight: PageSetting.headerHeight,
      headerWidth: `calc(100% - ${PageSetting.sliderWidth}px)`,
      visible: false,
      confirmLoading: false,
      form: {
        oldPwd: "",
        newPwd: "",
        rePwd: ""
      },
      rules: {
        oldPwd: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }
        ],
        newPwd: [
          {
            required: true,
            validator: validatePasswword,
            trigger: "blur"
          }
        ],
        rePwd: [
          {
            required: true,
            validator: validateRepasswword,
            trigger: "blur"
          }
        ]
      }
    }
  },
  watch: {
    collapsed: {
      handler(newVal) {
        if (newVal) {
          this.headerWidth = `calc(100% - ${PageSetting.collapsedWidth}px)`
        } else {
          this.headerWidth = `calc(100% - ${PageSetting.sliderWidth}px)`
        }
        eventBus.$emit("collapsed", newVal)
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["navigationmode", "user"])
  },
  mounted() {
    if (document.body.clientWidth <= 1600) {
      this.collapsed = true
    }
  },
  methods: {
    resetPwd() {
      this.visible = true
    },
    logout() {
      let _this = this
      _this.$confirm({
        title: "确定退出系统?",
        content: "",
        onOk() {
          return new Promise(resolve => {
            setTimeout(() => {
              _this.$store.dispatch("LogOut")
              resolve()
            }, 1000)
          }).catch(() => {})
        },
        onCancel() {}
      })
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          updatepwd({
            password: md5(md5(this.form.newPwd) + "wtws"),
            oldPassWord: md5(md5(this.form.oldPwd) + "wtws")
          })
            .then(res => {
              this.confirmLoading = false
              if (res.code === 14) {
                this.$store.dispatch("LogOut", false)
              }
            })
            .catch(() => {
              this.confirmLoading = false
            })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.form = {
        oldPwd: "",
        newPwd: "",
        rePwd: ""
      }
      this.$refs.form.clearValidate()
    }
  }
}
</script>
<style lang="scss" scoped>
.own-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0;
  padding-right: 30px !important;
  background: #fff;
  right: 0;
  top: 0;
  transition: all 0.2s;

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }
}
</style>
