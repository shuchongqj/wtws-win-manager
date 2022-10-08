<template>
  <div class="login">
    <div class="_box">
      <div class="_left">
        <img alt="" src="~@/assets/image/login-box-left.png" srcset="" />
      </div>
      <div class="_right">
        <div class="_top">
          <img alt="" class="_l" src="~@/assets/image/logo.png" srcset="" />
          <div class="_r">后台管理系统</div>
        </div>
        <div class="_title">账户密码登录</div>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          class="login-form"
        >
          <a-form-model-item ref="username" prop="username">
            <a-input
              v-model="form.username"
              allow-clear
              placeholder="用户名"
              @blur="
                () => {
                  $refs.username.onFieldBlur()
                }
              "
              @keyup.enter="onSubmit"
            >
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item ref="password" prop="password">
            <a-input
              v-model="form.password"
              allow-clear
              placeholder="密码"
              type="password"
              @blur="
                () => {
                  $refs.password.onFieldBlur()
                }
              "
              @keyup.enter="onSubmit"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-model-item>

          <!--          <SIdentify></SIdentify>-->

          <a-form-model-item class="remember" prop="remember">
            <a-checkbox-group v-model="form.remember">
              <a-checkbox :value="true" name="true">
                自动登录
              </a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item class="loginwrapper">
            <a-button
              :loading="loading"
              class="login-btn"
              type="primary"
              @click="onSubmit"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>
<script>
// import SIdentify from "@/components/Identify/index.vue"
import storage from "store"
import md5 from "js-md5" // 使用md5加密密码
import { defaultPassWord } from "@/config"

export default {
  // components: { SIdentify },
  data() {
    // 验证图形验证码
    // let validateImgCaptcha = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入图形验证码！"))
    //   } else if (value !== this.identifycode) {
    //     callback(new Error("图形验证码错误!"))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      identifycode: "", // 图形验证码
      // identifycodes: "1234567890",
      redirect: undefined,
      form: {
        username: "",
        password: "",
        // imgCaptcha: "",
        remember: []
      },
      loading: false, // 登录等待状态
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号/用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // // 生成图片验证码
    // this.refreshCode()
    // 获取本地是否记住密码
    this.getCookie()
  },
  methods: {
    // 获取本地session
    getCookie() {
      const username = storage.get("username")
      const password = storage.get("password")
      const remember = storage.get("remember")

      this.form = {
        username: username === undefined ? this.form.username : username,
        password: password,
        remember:
          remember === undefined
            ? []
            : Boolean(remember) === false
            ? []
            : [Boolean(remember)]
      }
    },
    // 登录
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        console.log(this.form.password)
        const user = {
          username: this.form.username,
          password: this.form.password,
          remember: this.form.remember
        }
        user.password = md5(md5(user.password) + "wtws")
        if (valid) {
          this.loading = true

          if (user.remember.length && user.remember[0]) {
            storage.set("username", user.username)
            storage.set("password", this.form.password)
            storage.set(
              "remember",
              user.remember[0] === undefined ? false : true
            )
          } else {
            storage.remove("username")
            storage.remove("password")
            storage.remove("remember")
          }
          this.$store
            .dispatch("Login", user)
            .then(res => {
              console.log(`login dispatch res:${JSON.stringify(res)}`)
              if (res.code === 0) {
                this.$message.success("登陆成功！")
                console.log(`this.form.password : ${this.form.password}`)
                if (this.form.password === defaultPassWord) {
                  this.$store.commit("SET_FIRST")
                  this.$router.push({
                    name: "Reset",
                    query: { account: this.form.username }
                  })
                } else {
                  this.$router.push({ path: "/dashboard/analysis" || "/" })
                }
              }
              //   }
              // })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
    // // 生成随机数
    // randomNum(min, max) {
    //   return Math.floor(Math.random() * (max - min) + min)
    // },
    // // 刷新图形验证码
    // refreshCode() {
    //   this.identifycode = ""
    //   this.makeCode(this.identifycodes, 4)
    // },
    // // 生成验证码
    // makeCode(o, l) {
    //   for (let i = 0; i < l; i++) {
    //     this.identifycode += this.identifycodes[
    //       this.randomNum(0, this.identifycodes.length)
    //     ]
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.login {
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
      }

      .login-form {
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
          &.remember {
            margin-bottom: 20px;

            &.ant-form-item-with-help {
              margin-bottom: 0;
            }
          }

          .login-btn {
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

          &.loginwrapper {
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
