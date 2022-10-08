<template>
  <div class="role_container">
    <a-spin :spinning="spinning">
      <div class="_left">
        <div class="_top">
          <a-menu
            :selected-keys="roleSelect"
            mode="inline"
            style="width: 250px"
            @click="handleClick"
          >
            <a-menu-item v-for="item in roleList" :key="item.roleID">
              {{ item.roleName }}
            </a-menu-item>
          </a-menu>
        </div>
        <div class="_bottom">
          <a-button
            :disabled="!hasAdd"
            class="_create"
            type="primary"
            @click="visible = true"
          >
            创建
          </a-button>
          <a-button
            :disabled="
              !hasDel ||
                roleSelect[0] == AdminRoleID ||
                roleSelect[0] === DriverRoleID
            "
            class="_del"
            type="danger"
            @click="DEL"
          >
            删除
          </a-button>
        </div>
      </div>
      <div class="_right">
        <div class="_center">
          <div class="_label">功能权限：</div>
          <div class="_group function-check">
            <a-tree
              v-model="functionSelect"
              :auto-expand-parent="autoExpandParent"
              :tree-data="resolvePermissionList"
              checkable
              @check="functionSelectCheck"
            />
          </div>
        </div>
        <div class="_bottom">
          <a-button
            :disabled="
              !hasUpdate ||
                roleSelect[0] === AdminRoleID ||
                roleSelect[0] === DriverRoleID
            "
            class="_update"
            type="primary"
            @click="updatePermission"
          >
            {{ notUpdate ? "修改" : "保存" }}
          </a-button>
        </div>
      </div>
    </a-spin>

    <!-- 新增角色 -->
    <a-modal
      :confirm-loading="confirmLoading"
      :visible="visible"
      class="role_modal"
      title="新增角色"
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
        <a-form-model-item label="角色名称" prop="roleName">
          <a-input v-model="form.roleName" />
        </a-form-model-item>
      </a-form-model>
      <div class="_content">
        <div class="_center">
          <div class="_label">功能权限：</div>
          <div class="_group function-check">
            <a-tree
              v-model="addFunctionSelect"
              :auto-expand-parent="autoExpandParent"
              :tree-data="addResolvePermissionList"
              checkable
              @check="addFunctionSelectCheck"
            />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
/**
 * 获取角色列表
 */
import { add, del, edit, find } from "@/api/system/role"
/**
 * 获取权限列表
 */
import { getrole } from "@/api/system/menu"
import {
  ADMIN_ROLE_ID,
  DRIVER_ROLE_ID,
  GET_ROLE_PROMISSION_FUN,
  GET_ROLE_PROMISSION_TYPE
} from "@/config"
// import _ from "lodash"

export default {
  data() {
    let validateRoleName = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5]+$/
      if (value.trim().length === 0) {
        callback(new Error("请输入角色名称"))
      } else if (!reg.test(value)) {
        callback(new Error("角色名称只能输入中文字符"))
      } else if (value.length < 2 || value.length > 7) {
        callback(new Error("角色名称2-7字符"))
      } else {
        callback()
      }
    }

    return {
      hasList: false, // 是否拥有获取角色列表的权限
      hasUpdate: false, // 是否拥有修改角色的权限
      hasAdd: false, // 是否拥有新增角色的权限
      hasDel: false, // 是否拥有删除角色的权限
      notUpdate: true, // 当前是否是修改状态
      spinning: false, // 页面loading
      roleSelect: [], // 角色选择
      roleList: [], // 角色列表
      permissionList: [], // 未处理的权限列表
      PPpermissionList: [], // 平铺后的权限列表
      resolvePermissionList: [], // 处理完的权限列表树
      autoExpandParent: true, // 展开父级TREE
      functionSelect: [], // 功能权限列表
      halfFunctionSelect: [],
      AdminRoleID: "", // 系统管理员ID
      DriverRoleID: DRIVER_ROLE_ID,

      visible: false,
      confirmLoading: false,

      form: {
        roleType: 1,
        roleName: ""
      },
      rules: {
        roleName: [
          { required: true, validator: validateRoleName, trigger: "blur" }
        ]
      },

      addPermissionList: [],
      addResolvePermissionList: [],
      addFunctionSelect: [],
      halfAddFunctionSelect: []
    }
  },
  created() {
    console.log(
      `this.$route.meta.code : ${JSON.stringify(this.$route.meta.code)}`
    )
    if (this.$route.meta.code.includes("修改角色功能")) {
      this.hasUpdate = true
    }
    if (this.$route.meta.code.includes("新增角色")) {
      this.hasAdd = true
    }
    if (this.$route.meta.code.includes("删除角色")) {
      this.hasDel = true
    }
    if (this.$route.meta.code.includes("获取角色列表")) {
      this.hasList = true
      this.initData()
      this.getRolePermission(GET_ROLE_PROMISSION_TYPE.ALL)
    }
  },
  watch: {
    roleSelect: {
      handler() {
        if (!this.notUpdate) {
          this.updatePermission()
        }
        this.clearChecked()
        this.$nextTick(() => {
          this.getRolePermission()
        })
      },
      deep: true
    },
    visible: {
      //监听表单隐现
      handler(newVal) {
        console.log(`newVal : ${newVal}`)
        if (newVal) {
          //显示表单
          this.getRolePermission(
            GET_ROLE_PROMISSION_TYPE.ALL,
            GET_ROLE_PROMISSION_FUN.ADD
          )
        } else {
          //隐藏表单
          this.form.roleName = ""
          this.addPermissionList = []
          this.addResolvePermissionList = []
          this.addFunctionSelect = []
        }
      }
    }
  },
  methods: {
    //初始化数据
    initData() {
      this.spinning = true
      //查找用户列表
      find({}).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.roleList = res.result
          this.roleSelect = [this.roleList[0].roleID] //默认选中第一个角色
          //获取admin role id
          this.AdminRoleID = this.roleList.filter(item => {
            return item.roleID === ADMIN_ROLE_ID
          })[0].roleID
        }
      })
    },
    updatePermission() {
      this.notUpdate = !this.notUpdate
      this.resolvePermissionList = this.resolvePermission(this.permissionList)

      if (this.notUpdate) {
        // 更新操作
        this.EDIT()
      }
    },

    //表单确认
    handleOk() {
      this.confirmLoading = true
      this.$refs.form.validate(valid => {
        console.log(`valid:${JSON.stringify(valid)}`)
        if (valid) {
          this.ADD()
            .then(res => {
              if (res.code === 12) {
                this.EDIT(res.result.roleID, "add")
                  .then(() => {
                    setTimeout(() => {
                      this.visible = false
                      this.confirmLoading = false
                    }, 2000)
                  })
                  .catch(() => {
                    this.confirmLoading = false
                  })
              } else {
                this.confirmLoading = false
              }
            })
            .catch(() => {
              setTimeout(() => {
                this.visible = false
                this.confirmLoading = false
              }, 2000)
            })
        } else {
          this.confirmLoading = false
        }
      })
    },

    //取消便捷表格
    handleCancel() {
      this.visible = false
    },

    //添加权限
    ADD() {
      return new Promise((resolve, reject) => {
        add(this.form)
          .then(res => {
            resolve(res)
          })
          .catch(() => {
            reject()
          })
      })
    },
    EDIT(role_id = "", type = "update") {
      return new Promise((resolve, reject) => {
        let funList = []
        if (type === "update") {
          role_id = this.roleSelect[0]
          funList = [...this.functionSelect, ...this.halfFunctionSelect]
        } else {
          funList = [...this.addFunctionSelect, ...this.halfAddFunctionSelect]
        }
        let params = []
        for (let i = 0; i < funList.length; i++) {
          const element = funList[i]
          params.push({
            roleID: role_id,
            functionID: element
          })
        }
        edit({ roleFunctionList: params })
          .then(editR => {
            if (editR.code === 0) {
              if (type === "add") {
                this.$message.success("新增成功")
              } else {
                this.$message.success("修改成功")
              }
              this.initData()
              resolve(editR)
            } else {
              reject()
            }
          })
          .catch(() => {
            reject()
          })
      })
    },
    DEL() {
      let _this = this
      this.$confirm({
        title: "确认删除该角色?",
        content: `请确认目前没有用户正在使用该角色，否则无法删除`,
        onOk() {
          del({ roleID: _this.roleSelect[0] }).then(res => {
            if (res.code === 16) {
              _this.$message.success("删除成功！该角色已从系统中删除。")
              _this.initData()
            }
          })
        },
        onCancel() {}
      })
    },
    /**
     * 显示表单时，查询权限功能
     * type = "all" 查全部  type = "single" 需要传role_id
     * fun = "list" 是角色修改  fun = "add" 是新增角色时用到
     */
    getRolePermission(
      type = GET_ROLE_PROMISSION_TYPE.SINGLE,
      fun = GET_ROLE_PROMISSION_FUN.LIST
    ) {
      this.spinning = true

      let role_id =
        type === GET_ROLE_PROMISSION_TYPE.ALL ? 1 : this.roleSelect[0]
      getrole({ roleId: role_id })
        .then(res => {
          this.spinning = false
          if (res.code === 0) {
            if (type === GET_ROLE_PROMISSION_TYPE.ALL) {
              if (fun === GET_ROLE_PROMISSION_FUN.LIST) {
                // this.permissionList = res.result.filter(item => {
                //   return item.systemCode !== "login"
                // })
                this.permissionList = res.result
                this.PPpermissionList = this.jsonToArray(
                  JSON.parse(JSON.stringify(this.permissionList))
                )
                this.$nextTick(() => {
                  this.resolvePermissionList = this.resolvePermission(
                    this.permissionList
                  )
                })
              } else {
                //表单去除系统管理权限
                this.addPermissionList = res.result.filter(
                  item => item.functionID !== 2
                )
                // console.log(`this.addPermissionList ： ${JSON.stringify(this.addPermissionList)}`)

                //默认选择的权限
                this.addFunctionSelect = this.addPermissionList
                  .filter(
                    item =>
                      item.systemCode === 1 && item.parentFunctionCode === 0
                  )
                  .map(it => {
                    return it.functionID
                  })

                this.$nextTick(() => {
                  this.addResolvePermissionList = this.resolvePermission(
                    this.addPermissionList,
                    false
                  )
                })
              }
            } else {
              this.choosePermisson(res.result)
              this.filterSelect()
            }
          }
        })
        .catch(() => {
          this.spinning = false
        })
    },
    // 勾选
    choosePermisson(list) {
      let _this = this
      list.map(item => {
        let childLength = _this.getChildren(item)
        if (
          childLength !== (item.children === null ? 0 : item.children.length)
        ) {
          this.halfFunctionSelect.push(item.functionID)
          this.getParentFunctionID(item.parentFunctionCode)
        } else {
          this.functionSelect.push(item.functionID)
        }
        if (item.children && item.children.length) {
          _this.choosePermisson(item.children)
        }
      })
    },
    getParentFunctionID(functionCode) {
      let list = this.PPpermissionList.filter(it => {
        return it.functionCode === functionCode
      })
      if (list.length !== 0) {
        this.halfFunctionSelect.push(list[0].functionID)
        if (list[0].parentFunctionCode !== "0") {
          this.getParentFunctionID(list[0].parentFunctionCode)
        }
      }
    },
    filterSelect() {
      for (let i = 0; i < this.functionSelect.length; i++) {
        const element = this.functionSelect[i]
        for (let j = 0; j < this.halfFunctionSelect.length; j++) {
          const elementj = this.halfFunctionSelect[j]
          if (elementj === element) {
            this.functionSelect.splice(i, 1)
            i = i - 1
          }
        }
      }
    },
    getChildren(item) {
      return this.PPpermissionList.filter(it => {
        return it.parentFunctionCode === item.functionCode
      }).length
    },
    jsonToArray(nodes) {
      let _this = this
      var r = []
      if (Array.isArray(nodes)) {
        for (var i = 0, l = nodes.length; i < l; i++) {
          r.push(nodes[i]) // 取每项数据放入一个新数组
          if (
            Array.isArray(nodes[i]["children"]) &&
            nodes[i]["children"].length > 0
          )
            // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
            r = r.concat(_this.jsonToArray(nodes[i]["children"]))
          delete nodes[i]["children"]
        }
      }
      return r
    },
    // 处理权限未勾选
    resolvePermission(list, notUpdate = this.notUpdate) {
      let _this = this
      return list.map(item => {
        let obj = {
          title: item.functionName,
          key: item.functionID
        }
        if (item.parentFunctionCode === 0 && item.systemCode === 1) {
          obj["disableCheckbox"] = true
        }
        if (notUpdate) {
          obj["disableCheckbox"] = true
        }
        if (item.children && item.children.length) {
          obj["children"] = _this.resolvePermission(item.children, notUpdate)
        }
        return obj
      })
    },
    handleClick(e) {
      this.roleSelect = [e.key]
    },
    clearChecked() {
      this.functionSelect = []
      this.halfFunctionSelect = []
    },
    functionSelectCheck(checkedKeys, e) {
      this.halfFunctionSelect = e.halfCheckedKeys
    },
    addFunctionSelectCheck(checkedKeys, e) {
      this.halfAddFunctionSelect = e.halfCheckedKeys
    }
  }
}
</script>
<style lang="scss" scoped>
.role_container {
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 16px 0;
  display: flex;
  align-items: flex-start;

  /deep/ .ant-spin-nested-loading,
  /deep/ .ant-spin-container {
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }

  ._left,
  ._right {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  ._left {
    width: 250px;
    border-right: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ._bottom {
      display: flex;
      align-items: center;
      justify-content: center;

      ._del {
        margin-left: 20px;
      }
    }
  }

  ._right {
    flex: 1;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    flex-direction: column;

    ._top,
    ._bottom {
      box-sizing: border-box;
      padding: 0 20px;
    }

    ._center {
      flex: 1;
      display: flex;
      align-items: flex-start;
      padding: 12px 20px;

      ._label {
        width: 100px;
        line-height: 30px;
      }

      .function-check {
        /deep/ .ant-tree > li:first-child {
          padding-top: 4px;
        }
      }
    }

    ._top {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #e8e8e8;

      ._label {
        width: 100px;
      }

      .login-check {
        flex: 1;
        display: flex;
        align-items: center;
      }
    }

    ._bottom {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
