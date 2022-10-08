<template>
  <div class="resetpwd">
    <div class="_box">
      <div class="_left">
        <img alt="" src="~@/assets/image/login-box-left.png" srcset="" />
      </div>
      <div class="_right">
        <div class="_top">
          <img alt="" class="_l" src="~@/assets/image/logo.png" srcset="" />
          <div class="_r">后台管理系统</div>
        </div>
        <div class="_title">
          修改密码<span>（首次登录必须先修改密码）</span>
        </div>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          class="resetpwd-form"
        >
          <a-form-model-item ref="username" prop="username">
            <a-input
              v-model="form.username"
              :disabled="true"
              allow-clear
              placeholder="用户名/手机号"
              @blur="
                () => {
                  $refs.username.onFieldBlur()
                }
              "
            >
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item ref="oldpassword" prop="oldpassword">
            <a-input
              v-model="form.oldpassword"
              allow-clear
              placeholder="输入旧密码"
              type="password"
              @blur="
                () => {
                  $refs.oldpassword.onFieldBlur()
                }
              "
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item ref="password" prop="password">
            <a-popover
              :visible="popoverVisible"
              overlayClassName="login-form-popover"
              placement="rightTop"
              trigger="click"
            >
              <template slot="content">
                <div>
                  <a-icon
                    :style="{ color: hasSpeace ? '#0B7EF8' : '#52c41a' }"
                    :type="hasSpeace ? 'exclamation-circle' : 'check-circle'"
                    theme="filled"
                  />
                  <span>不能包含空格</span>
                </div>
                <div>
                  <a-icon
                    :style="{ color: trueLength ? '#0B7EF8' : '#52c41a' }"
                    :type="trueLength ? 'exclamation-circle' : 'check-circle'"
                    theme="filled"
                  />
                  <span>长度为6-11个字符</span>
                </div>
                <div>
                  <a-icon
                    :style="{ color: hasSpecial ? '#0B7EF8' : '#52c41a' }"
                    :type="hasSpecial ? 'exclamation-circle' : 'check-circle'"
                    theme="filled"
                  />
                  <span>由数字和字母组成，<br />不能包含特殊字符</span>
                </div>
              </template>
              <a-input
                v-model="form.password"
                allow-clear
                placeholder="输入新密码"
                type="password"
                @blur="
                  () => {
                    popoverVisible = false
                    $refs.password.onFieldBlur()
                  }
                "
                @change="passwordChange"
                @focus="
                  () => {
                    popoverVisible = true
                  }
                "
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-popover>
          </a-form-model-item>
          <a-form-model-item ref="repassword" prop="repassword">
            <a-input
              v-model="form.repassword"
              allow-clear
              placeholder="再次输入"
              type="password"
              @blur="
                () => {
                  $refs.repassword.onFieldBlur()
                }
              "
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item class="resetpwdwrapper">
            <a-button
              :loading="loading"
              class="resetpwd-btn"
              type="primary"
              @click="onSubmit"
            >
              <span v-if="!loading">提 交</span>
              <span v-else>提 交 中...</span>
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5" // 使用md5加密密码
import { updatepwd } from "@/api/user"
import { defaultPassWord } from "@/config"

export default {
  data() {
    // 验证确认密码
    let validateRepasswword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次确认密码"))
      } else if (value !== this.form.password) {
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
      cookiePass: "",
      account: undefined,
      form: {
        username: "",
        password: "",
        oldpassword: defaultPassWord,
        repassword: ""
      },
      hasSpeace: true,
      trueLength: true,
      hasSpecial: true,
      loading: false, // 登录等待状态
      popoverVisible: false,
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号/用户名",
            trigger: "blur"
          }
        ],
        oldpassword: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: validatePasswword,
            trigger: "blur"
          }
        ],
        repassword: [
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
    $route: {
      handler: function(route) {
        this.account = route.query && route.query.account
        this.form.username = this.account
      },
      immediate: true
    }
  },
  methods: {
    // 密码框修改
    passwordChange(e) {
      let { value } = e.target
      if (value.includes(" ") || value.trim() === "") {
        this.hasSpeace = true
      } else {
        this.hasSpeace = false
      }
      // 新密码正则验证
      let special = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)
      if (special.test(value)) {
        this.hasSpecial = false
      } else {
        this.hasSpecial = true
      }

      if (value.length < 6 || value.length > 10) {
        this.trueLength = true
      } else {
        this.trueLength = false
      }
    },
    // 登录
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          updatepwd({
            password: md5(md5(this.form.password) + "wtws"),
            oldPassWord: md5(md5(this.form.oldpassword) + "wtws")
          })
            .then(res => {
              console.log(`research =====> ${JSON.stringify(res)}`)
              // this.loading = false
              if (res.code === 14) {
                this.$store.commit("SET_FIRST", false)
                // this.$store.dispatch("LogOut", false)
                this.$router.push({ path: "/dashboard/analysis" || "/" })
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.resetpwd {
  min-width: 1100px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("~@/assets/image/background.png") no-repeat 50%;
  background-size: cover;
  box-sizing: border-box;

  ._box {
    width: 1022px;
    height: 549px;
    background: #ffffff;
    border-radius: 10px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    ._left {
      img {
        display: block;
        width: 406px;
        height: 406px;
        margin-left: 67px;
        margin-right: 97px;
      }
    }

    ._right {
      flex: 1;

      ._top {
        display: flex;
        align-items: center;
        margin-bottom: 50px;

        ._l {
          margin-right: 70px;
          display: block;
          width: 100px;
          height: 100px;
        }

        ._r {
          font-size: 24px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #0b7ef8;
          position: relative;

          &::before {
            content: "";
            display: block;
            width: 1px;
            height: 28px;
            background-color: #0b7ef8;
            position: absolute;
            left: -34px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      ._title {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #1890ff;
        margin-bottom: 19px;

        span {
          color: #c0c0c0;
        }
      }

      .resetpwd-form {
        border-radius: 6px;
        // background: #fff;
        width: 385px;

        ._title {
          margin: 0 auto 30px auto;
          text-align: center;
          color: #707070;
          font-weight: bold;
        }

        /deep/ .ant-input {
          height: 42px;
          line-height: 41px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-radius: 0;

          &:focus {
            outline: none;
            box-shadow: none;
          }
        }

        /deep/ .ant-input-prefix,
        /deep/ .ant-checkbox-wrapper {
          color: #c0c0c0;
        }

        /deep/ .ant-input-affix-wrapper .ant-input:not(:first-child) {
          padding-left: 37px;
        }

        /deep/ .ant-form-item {
          .resetpwd-btn {
            // width: 100%;
            // height: 38px;
            // line-height: 37px;
            width: 332px;
            height: 50px;
            background: linear-gradient(138deg, #74e3f9 14%, #0b7ef8 86%);
            border-radius: 25px;
            margin: 0 auto;
            border: none;
            line-height: 50px;
            font-size: 22px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
          }

          &.resetpwdwrapper {
            .ant-form-item-control-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style>
