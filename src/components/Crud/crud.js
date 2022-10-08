import { initData } from "@/api/data"
import { parseTime } from "@/utils/utils"
import Vue from "vue"

/**
 * CRUD配置
 * @author moxun
 * @param {*} options <br>
 * @return crud instance.
 * @example
 * 要使用多crud时，请在关联crud的组件处使用crud-tag进行标记，如：<jobForm :job-status="dict.job_status" crud-tag="job" />
 */
function CRUD(options) {
  const defaultOptions = {
    tag: "default",
    // id字段名
    idField: "id",
    // 标题
    title: "",
    // 请求数据的url
    baseURL: process.env.VUE_APP_API_URL,
    url: "",
    // 表格数据
    data: [],
    // 表格列数
    columns: [],
    // 选择项
    selections: [],
    // 待查询的对象
    query: {},
    // 查询数据的参数
    params: {},
    // 查询方法
    queryFun: null,
    // Form 表单
    form: {},
    // 重置表单
    defaultForm: () => {},
    // 深拷贝form
    copyForm: () => {},
    // 排序规则，默认 id 降序， 支持多字段排序 ['id,desc', 'createTime,asc']
    // sort: ["id,desc"],
    // 等待时间
    time: 50,
    // CRUD Method
    crudMethod: {
      // eslint-disable-next-line no-unused-vars
      add: form => {},
      // eslint-disable-next-line no-unused-vars
      del: selectedRows => {},
      // eslint-disable-next-line no-unused-vars
      edit: form => {},
      // eslint-disable-next-line no-unused-vars
      get: null,
      // eslint-disable-next-line no-unused-vars
      downLoadAll: params => {}
    },
    // 操作栏按钮是否有权限
    permission: {
      add: true,
      edit: true,
      del: true,
      download: true
    },
    // 主页操作栏显示哪些按钮
    optShow: {
      add: true,
      edit: true,
      del: true,
      download: true,
      reset: true
    },
    // 自定义一些扩展属性
    props: {},
    // 在主页准备
    queryOnPresenterCreated: true,
    // 调试开关
    debug: false
  }
  options = mergeOptions(defaultOptions, options)
  const data = {
    ...options,
    // 记录数据状态
    dataStatus: {},
    status: {
      add: CRUD.STATUS.NORMAL,
      edit: CRUD.STATUS.NORMAL,
      info: CRUD.STATUS.NORMAL,
      // 添加或编辑状态
      get cu() {
        if (
          this.add === CRUD.STATUS.NORMAL &&
          this.edit === CRUD.STATUS.NORMAL
        ) {
          return CRUD.STATUS.NORMAL
        } else if (
          this.add === CRUD.STATUS.PREPARED ||
          this.edit === CRUD.STATUS.PREPARED
        ) {
          return CRUD.STATUS.PREPARED
        } else if (
          this.add === CRUD.STATUS.PROCESSING ||
          this.edit === CRUD.STATUS.PROCESSING
        ) {
          return CRUD.STATUS.PROCESSING
        }
        throw new Error("wrong crud's cu status")
      },
      // 获取详情状态
      get in() {
        return this.info
      },
      // 标题
      get title() {
        return this.add > CRUD.STATUS.NORMAL
          ? `新增${crud.title}`
          : this.edit > CRUD.STATUS.NORMAL
          ? `编辑${crud.title}`
          : this.info > CRUD.STATUS.NORMAL
          ? `${crud.title}详情`
          : crud.title
      }
    },
    msg: {
      submit: "提交成功",
      add: "新增成功",
      edit: "编辑成功",
      del: "删除成功"
    },
    advanced: false,
    page: {
      // 页码
      page: 0,
      // 每页数据条数
      size: 10,
      // 总数据条数
      total: 0
    },
    // 整体loading
    loading: false,
    // 导出的 Loading
    downloadLoading: false,
    // 删除的 Loading
    delAllLoading: false
  }
  const methods = {
    /**
     * 展开、收缩搜索
     */
    toggleAdvanced() {
      crud.advanced = !crud.advanced
    },
    /**
     * 通用的提示
     */
    submitSuccessNotify() {
      crud.notify(crud.msg.submit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    addSuccessNotify() {
      crud.notify(crud.msg.add, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    editSuccessNotify() {
      crud.notify(crud.msg.edit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    delSuccessNotify() {
      crud.notify(crud.msg.del, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    // 通用处理data方法
    resolveData(data, crud) {
      if (data.code === 0) {
        for (const key in data.result) {
          if (key.includes("list")) {
            crud.data = data.result[key] === null ? [] : data.result[key]
          }
        }
        crud.page.total = data.result.count
        crud.resetDataStatus()
      }
    },
    // 搜索
    toQuery(callback) {
      crud.page.page = 1
      crud.refresh(callback)
    },
    // 刷新
    refresh(callback) {
      callback = callback
        ? callback
        : crud.queryFun
        ? crud.queryFun
        : crud.resolveData
      if (!callVmHook(crud, CRUD.HOOK.beforeRefresh)) {
        return
      }
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        crud.loading = true
        crud.selections = []
        // success handler
        let success = (data, resolve) => {
          crud.page.total = 0
          crud.data = []

          callback(data, crud)
          // time 毫秒后显示表格
          setTimeout(() => {
            crud.loading = false
            callVmHook(crud, CRUD.HOOK.afterRefresh)
          }, crud.time)

          resolve(data)
        }

        let fun =
          crud.crudMethod.get === null || crud.crudMethod.get === undefined
            ? initData
            : crud.crudMethod.get

        if (crud.crudMethod.get === null || crud.crudMethod.get === undefined) {
          // 请求数据
          fun(crud.url, crud.getQueryParams(), crud.baseURL)
            .then(data => {
              // const table = crud.getTable()
              // if (table && table.lazy) {
              //   // 懒加载子节点数据，清掉已加载的数据
              //   table.store.states.treeData = {}
              //   table.store.states.lazyTreeNodeMap = {}
              // }

              success(data, resolve)
            })
            .catch(err => {
              crud.loading = false
              reject(err)
            })
        } else {
          // 请求数据
          fun(crud.getQueryParams())
            .then(data => {
              success(data, resolve)
            })
            .catch(err => {
              crud.loading = false
              reject(err)
            })
        }
      })
    },
    // 获取详情
    getInfo(key) {
      return new Promise((resolve, reject) => {
        crud.crudMethod
          .get(key)
          .then(res => {
            if (res.code === 0) {
              resolve(res)
            } else {
              reject()
            }
          })
          .catch(() => {
            reject()
          })
      })
    },
    /**
     * 启动添加
     */
    toAdd() {
      crud.resetForm()
      if (
        !(
          callVmHook(crud, CRUD.HOOK.beforeToAdd, crud.form) &&
          callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form)
        )
      ) {
        return
      }
      crud.status.add = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToAdd, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    /**
     * 启动添加
     */
    toInfo(data) {
      crud.resetForm(JSON.parse(JSON.stringify(data)))
      if (
        !(
          callVmHook(crud, CRUD.HOOK.beforeToInfo, crud.form) &&
          callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form)
        )
      ) {
        return
      }
      crud.status.info = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToInfo, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    /**
     * 启动编辑
     * @param {*} data 数据项
     */
    toEdit(data) {
      data = data || crud.copyForm
      crud.resetForm(JSON.parse(JSON.stringify(data)))
      if (
        !(
          callVmHook(crud, CRUD.HOOK.beforeToEdit, crud.form) &&
          callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form)
        )
      ) {
        return
      }
      crud.status.edit = CRUD.STATUS.PREPARED
      crud.getDataStatus(crud.getDataId(data)).edit = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToEdit, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    /**
     * 启动删除
     * @param {*} data 数据项
     */
    toDelete(data) {
      crud.getDataStatus(crud.getDataId(data)).delete = CRUD.STATUS.PREPARED
    },
    /**
     * 取消删除
     * @param {*} data 数据项
     */
    cancelDelete(data) {
      if (!callVmHook(crud, CRUD.HOOK.beforeDeleteCancel, data)) {
        return
      }
      crud.getDataStatus(crud.getDataId(data)).delete = CRUD.STATUS.NORMAL
      callVmHook(crud, CRUD.HOOK.afterDeleteCancel, data)
    },
    /**
     * 取消新增/编辑
     * type = "close" 关闭 type = "info" 返回 type = "uptoinfo" info 状态
     */
    cancelCU(type = "close") {
      if (type === "info" || type === "uptoinfo") {
        let addStatus = crud.status.add
        let editStatus = crud.status.edit
        if (type === "info") {
          crud.toInfo(crud.form)
        }

        if (type === "uptoinfo") {
          crud.toInfo(crud.copyForm)
        }

        if (addStatus === CRUD.STATUS.PREPARED) {
          crud.status.add = CRUD.STATUS.NORMAL
        }
        if (editStatus === CRUD.STATUS.PREPARED) {
          crud.status.edit = CRUD.STATUS.NORMAL
          // crud.getDataStatus(crud.getDataId(crud.form)).edit =
          //   CRUD.STATUS.NORMAL
        }
      } else {
        if (crud.status.in > 0) {
          crud.cancelCUInfo()
        }

        if (crud.status.in == 0 && crud.status.cu == 0) {
          crud.cancelCUInfo()
        }

        if (crud.status.cu > 0) {
          let addStatus = crud.status.add
          let editStatus = crud.status.edit

          if (addStatus === CRUD.STATUS.PREPARED) {
            if (!callVmHook(crud, CRUD.HOOK.beforeAddCancel, crud.form)) {
              return
            }
            crud.status.add = CRUD.STATUS.NORMAL
          }
          if (editStatus === CRUD.STATUS.PREPARED) {
            if (!callVmHook(crud, CRUD.HOOK.beforeEditCancel, crud.form)) {
              return
            }
            crud.status.edit = CRUD.STATUS.NORMAL
            crud.getDataStatus(crud.getDataId(crud.form)).edit =
              CRUD.STATUS.NORMAL
          }

          crud.resetForm()

          if (addStatus === CRUD.STATUS.PREPARED) {
            callVmHook(crud, CRUD.HOOK.afterAddCancel, crud.form)
          }
          if (editStatus === CRUD.STATUS.PREPARED) {
            callVmHook(crud, CRUD.HOOK.afterEditCancel, crud.form)
          }
          // 清除表单验证
          if (crud.findVM("form").$refs["form"]) {
            crud.findVM("form").$refs["form"].clearValidate()
          }
        }
      }
    },
    /**
     * 详情关闭
     * type = "close" 关闭弹窗 type = "edit" 修改弹窗
     */
    cancelCUInfo(type = "close") {
      const infoStatus = crud.status.info
      if (infoStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeInfoCancel, crud.form)) {
          return
        }
        crud.status.info = CRUD.STATUS.NORMAL
      }
      if (type === "close") {
        crud.resetForm()
      }
      if (infoStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterin, crud.form)
      }
    },
    /**
     * 提交新增/编辑
     */
    submitCU(success) {
      if (!callVmHook(crud, CRUD.HOOK.beforeValidateCU)) {
        return
      }
      crud.findVM("form").$refs["form"].validate(valid => {
        if (!valid) {
          return
        }
        if (!callVmHook(crud, CRUD.HOOK.afterValidateCU)) {
          return
        }
        if (crud.status.add === CRUD.STATUS.PREPARED) {
          crud.doAdd(success)
        } else if (crud.status.edit === CRUD.STATUS.PREPARED) {
          crud.doEdit(success)
        }
      })
    },
    /**
     * 执行添加
     */
    doAdd(success) {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.status.add = CRUD.STATUS.PROCESSING

      crud.crudMethod
        .add(crud.form)
        .then(res => {
          if (res.code === 12) {
            crud.status.add = CRUD.STATUS.PREPARED
            callVmHook(crud, CRUD.HOOK.afterSubmit)
            crud.cancelCU("close")
            crud.copyForm[crud.idField] = res.result
            // crud.addSuccessNotify()
            crud.toQuery(crud.queryFun ? crud.queryFun : crud.resolveData)
            setTimeout(() => {
              typeof success === "function" && success(res)
            }, 1000)
          } else {
            crud.status.add = CRUD.STATUS.PREPARED
            callVmHook(crud, CRUD.HOOK.afterAddError)
          }
        })
        .catch(() => {
          crud.status.add = CRUD.STATUS.PREPARED
          callVmHook(crud, CRUD.HOOK.afterAddError)
        })
    },
    /**
     * 执行编辑
     */
    doEdit(success) {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.status.edit = CRUD.STATUS.PROCESSING
      crud.crudMethod
        .edit(crud.form)
        .then(res => {
          if (res.code === 14) {
            crud.status.edit = CRUD.STATUS.NORMAL
            crud.getDataStatus(crud.getDataId(crud.form)).edit =
              CRUD.STATUS.NORMAL
            // crud.editSuccessNotify()
            crud.cancelCU("info")
            callVmHook(crud, CRUD.HOOK.afterSubmit)
            typeof success === "function" && success(res)
            setTimeout(() => {
              crud.refresh()
            }, 1000)
          } else {
            crud.status.edit = CRUD.STATUS.PREPARED
            callVmHook(crud, CRUD.HOOK.afterEditError)
          }
        })
        .catch(() => {
          crud.status.edit = CRUD.STATUS.PREPARED
          callVmHook(crud, CRUD.HOOK.afterEditError)
        })
    },
    /**
     * 执行删除
     * @param {*} data 数据项
     * type = 'close'  关闭弹窗
     */
    doDelete(data, type = "", success) {
      data = data === null ? [this.getDataId(crud.copyForm)] : data
      let delAll = false
      let dataStatus
      const ids = data
      if (data instanceof Array) {
        delAll = true
      }
      if (!callVmHook(crud, CRUD.HOOK.beforeDelete, data)) {
        return
      }
      if (!delAll) {
        dataStatus.delete = CRUD.STATUS.PROCESSING
      }
      return new Promise((resolve, reject) => {
        crud.crudMethod
          .del(ids)
          .then(res => {
            if (delAll) {
              crud.delAllLoading = false
            } else {
              dataStatus.delete = CRUD.STATUS.PREPARED
            }

            if (res.code === 16) {
              typeof success === "function" && success(res)
            }

            setTimeout(() => {
              crud.dleChangePage(crud)
              // crud.delSuccessNotify()
              callVmHook(crud, CRUD.HOOK.afterDelete, data)
              if (type === "close") {
                crud.cancelCUInfo()
              }
            }, 1000)

            resolve(res)
          })
          .catch(err => {
            reject(err)
            if (delAll) {
              crud.delAllLoading = false
            } else dataStatus.delete = CRUD.STATUS.PREPARED
          })
      })
    },
    /**
     * 导出选中
     */
    doExport() {
      crud.downloadLoading = true
      console.log("download")
      // download(crud.url + "/download", crud.getQueryParams())
      //   .then(result => {
      //     downloadFile(result, crud.title + "数据", "xlsx")
      //     crud.downloadLoading = false
      //   })
      //   .catch(() => {
      //     crud.downloadLoading = false
      //   })
    },
    /**
     * 导出全部
     */
    doAllExport() {
      crud.downloadLoading = true
      let params = crud.getQueryParams()
      params["isExport"] = "1"
      crud.crudMethod
        .downLoadAll(params)
        .then(res => {
          crud.downloadLoading = false
          var blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8"
          })
          var downloadElement = document.createElement("a")
          var href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.href = href
          downloadElement.download = `${crud.title}${new Date().getTime()}.xls` //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
        .catch(() => {
          crud.downloadLoading = false
        })
      // download(crud.url + "/download", crud.getQueryParams())
      //   .then(result => {
      //     downloadFile(result, crud.title + "数据", "xlsx")
      //     crud.downloadLoading = false
      //   })
      //   .catch(() => {
      //     crud.downloadLoading = false
      //   })
    },
    /**
     * 获取查询参数
     */
    getQueryParams: function() {
      // 清除参数无值的情况
      Object.keys(crud.query).length !== 0 &&
        Object.keys(crud.query).forEach(item => {
          if (crud.query[item] === null || crud.query[item] === "")
            crud.query[item] = undefined
        })
      Object.keys(crud.params).length !== 0 &&
        Object.keys(crud.params).forEach(item => {
          if (crud.params[item] === null || crud.params[item] === "")
            crud.params[item] = undefined
        })
      return {
        pageNum: crud.page.page,
        pageSize: crud.page.size,
        ...crud.query,
        ...crud.params
      }
    },
    // 当前页改变
    pageChangeHandler(e) {
      crud.page.page = e
      crud.refresh(crud.queryFun ? crud.queryFun : crud.resolveData)
    },
    // 每页条数改变
    sizeChangeHandler(current, size) {
      crud.page.size = size
      crud.page.page = 1
      crud.refresh(crud.queryFun ? crud.queryFun : crud.resolveData)
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(crud) {
      crud.toQuery(crud.queryFun ? crud.queryFun : crud.resolveData)
    },
    // 选择改变
    // eslint-disable-next-line no-unused-vars
    selectionChangeHandler(selectedRowKeys, selectedRows) {
      // console.log(`selectionChangeHandler selectedRowKeys:${JSON.stringify(selectedRowKeys)}, selectedRows:${JSON.stringify(selectedRows)}`)
      crud.selections = selectedRowKeys
    },
    /**
     * 重置查询参数
     * @param {Boolean} toQuery 重置后进行查询操作
     */
    resetQuery(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(crud.defaultQuery))
      const query = crud.query
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key]
      })
      // 重置参数
      this.params = {}
      if (toQuery) {
        crud.toQuery(crud.queryFun ? crud.queryFun : crud.resolveData)
      }
    },
    /**
     * 重置表单
     * @param {Array} data 数据
     */
    resetForm(data) {
      const form =
        data ||
        (typeof crud.defaultForm === "object"
          ? JSON.parse(JSON.stringify(crud.defaultForm))
          : crud.defaultForm.apply(crud.findVM("form")))

      crud.copyForm = JSON.parse(JSON.stringify(form))
      const crudFrom = crud.form
      for (const key in form) {
        // eslint-disable-next-line no-prototype-builtins
        if (crudFrom.hasOwnProperty(key)) {
          crudFrom[key] = form[key]
        } else {
          Vue.set(crudFrom, key, form[key])
        }
      }

      // 清除表单验证
      if (crud.findVM("form").$refs["form"]) {
        crud.findVM("form").$refs["form"].clearValidate()
      }
    },
    /**
     * 重置数据状态
     */
    resetDataStatus() {
      const dataStatus = {}

      function resetStatus(datas) {
        datas.forEach(e => {
          dataStatus[crud.getDataId(e)] = {
            delete: 0,
            edit: 0
          }
          if (e.children) {
            resetStatus(e.children)
          }
        })
      }

      resetStatus(crud.data)
      crud.dataStatus = dataStatus
    },
    /**
     * 获取数据状态
     * @param {Number | String} id 数据项id
     */
    getDataStatus(id) {
      return crud.dataStatus[id]
    },
    /**
     * 用于树形表格多选, 选中所有
     * @param selection
     */
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
      if (selection && selection.length === crud.data.length) {
        selection.forEach(val => {
          crud.selectChange(selection, val)
        })
      } else {
        crud.getTable().clearSelection()
      }
    },
    /**
     * 切换选中状态
     * @param selection
     * @param data
     */
    toggleRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          crud.getTable().toggleRowSelection(val, false)
          if (val.children) {
            crud.toggleRowSelection(selection, val)
          }
        })
      }
    },
    findVM(type) {
      return crud.vms.find(vm => vm && vm.type === type).vm
    },
    notify(title, type = CRUD.NOTIFICATION_TYPE.INFO) {
      crud.vms[0].vm.$notify({
        title,
        type,
        duration: 2500
      })
    },
    updateProp(name, value) {
      Vue.set(crud.props, name, value)
    },
    getDataId(data) {
      return data[this.idField]
    },
    getTable() {
      return this.findVM("presenter").$refs.table
    },
    attchTable() {
      const table = this.getTable()
      this.updateProp("table", table)
      const that = this
      table.$on("expand-change", (row, expanded) => {
        if (!expanded) {
          return
        }
        const lazyTreeNodeMap = table.store.states.lazyTreeNodeMap
        row.children = lazyTreeNodeMap[crud.getDataId(row)]
        if (row.children) {
          row.children.forEach(ele => {
            const id = crud.getDataId(ele)
            if (that.dataStatus[id] === undefined) {
              that.dataStatus[id] = {
                delete: 0,
                edit: 0
              }
            }
          })
        }
      })
    }
  }

  const crud = Object.assign({}, data)
  // 可观测化
  Vue.observable(crud)
  // 附加方法
  Object.assign(crud, methods)
  // 记录初始默认的查询参数，后续重置查询时使用
  Object.assign(crud, {
    defaultQuery: JSON.parse(JSON.stringify(data.query)),
    // 预留4位存储：组件 主页、头部、分页、表单，调试查看也方便找
    vms: Array(4),
    /**
     * 注册组件实例
     * @param {String} type 类型
     * @param {*} vm 组件实例
     * @param {Number} index 该参数内部使用
     */
    registerVM(type, vm, index = -1) {
      const vmObj = {
        type,
        vm: vm
      }
      if (index < 0) {
        this.vms.push(vmObj)
        return
      }
      if (index < 4) {
        // 内置预留vm数
        this.vms[index] = vmObj
        return
      }
      this.vms.length = Math.max(this.vms.length, index)
      this.vms.splice(index, 1, vmObj)
    },
    /**
     * 取消注册组件实例
     * @param {*} vm 组件实例
     */
    unregisterVM(type, vm) {
      for (let i = this.vms.length - 1; i >= 0; i--) {
        if (this.vms[i] === undefined) {
          continue
        }
        if (this.vms[i].type === type && this.vms[i].vm === vm) {
          if (i < 4) {
            // 内置预留vm数
            this.vms[i] = undefined
          } else {
            this.vms.splice(i, 1)
          }
          break
        }
      }
    }
  })
  // 冻结处理，需要扩展数据的话，使用crud.updateProp(name, value)，以crud.props.name形式访问，这个是响应式的，可以做数据绑定
  Object.freeze(crud)
  return crud
}

// hook VM
function callVmHook(crud, hook) {
  if (crud.debug) {
    console.log("callVmHook: " + hook)
  }
  const tagHook = crud.tag ? hook + "$" + crud.tag : null
  let ret = true
  const nargs = [crud]
  for (let i = 2; i < arguments.length; ++i) {
    nargs.push(arguments[i])
  }
  // 有些组件扮演了多个角色，调用钩子时，需要去重
  const vmSet = new Set()
  crud.vms.forEach(vm => vm && vmSet.add(vm.vm))
  vmSet.forEach(vm => {
    if (vm[hook]) {
      ret = vm[hook].apply(vm, nargs) !== false && ret
    }
    if (tagHook && vm[tagHook]) {
      ret = vm[tagHook].apply(vm, nargs) !== false && ret
    }
  })
  return ret
}

function mergeOptions(src, opts) {
  const optsRet = {
    ...src
  }
  for (const key in src) {
    // eslint-disable-next-line no-prototype-builtins
    if (opts.hasOwnProperty(key)) {
      optsRet[key] = opts[key]
    }
  }
  return optsRet
}

/**
 * 查找crud
 * @param {*} vm
 * @param {string} tag
 */
function lookupCrud(vm, tag) {
  tag = tag || vm.$attrs["crud-tag"] || "default"
  // function lookupCrud(vm, tag) {
  if (vm.$crud) {
    const ret = vm.$crud[tag]
    if (ret) {
      return ret
    }
  }
  return vm.$parent ? lookupCrud(vm.$parent, tag) : undefined
}

/**
 * crud主页
 */
function presenter(crud) {
  if (crud) {
    console.warn(
      "[CRUD warn]: " +
        "please use $options.cruds() { return CRUD(...) or [CRUD(...), ...] }"
    )
  }
  return {
    data() {
      // 在data中返回crud，是为了将crud与当前实例关联，组件观测crud相关属性变化
      return {
        crud: this.crud
      }
    },
    beforeCreate() {
      this.$crud = this.$crud || {}

      let cruds =
        this.$options.cruds instanceof Function ? this.$options.cruds() : crud
      if (!(cruds instanceof Array)) {
        cruds = [cruds]
      }
      cruds.forEach(ele => {
        if (this.$crud[ele.tag]) {
          console.error(
            "[CRUD error]: " + "crud with tag [" + ele.tag + " is already exist"
          )
        }
        this.$crud[ele.tag] = ele
        ele.registerVM("presenter", this, 0)
      })
      this.crud = this.$crud["defalut"] || cruds[0]
    },
    methods: {
      parseTime
    },
    created() {
      for (const k in this.$crud) {
        if (this.$crud[k].queryOnPresenterCreated) {
          this.$crud[k].toQuery(
            this.$crud[k].queryFun
              ? this.$crud[k].queryFun
              : this.$crud[k].resolveData
          )
        }
      }
    },
    destroyed() {
      for (const k in this.$crud) {
        this.$crud[k].unregisterVM("presenter", this)
      }
    },
    mounted() {
      // 如果table未实例化（例如使用了v-if），请稍后在适当时机crud.attchTable刷新table信息
      if (this.$refs.table !== undefined) {
        this.crud.attchTable()
      }
    }
  }
}

/**
 * 头部
 */
function header() {
  return {
    data() {
      return {
        crud: this.crud,
        query: this.crud.query
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM("header", this, 1)
    },
    destroyed() {
      this.crud.unregisterVM("header", this)
    }
  }
}

/**
 * 分页
 */
function pagination() {
  return {
    data() {
      return {
        crud: this.crud,
        page: this.crud.page
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM("pagination", this, 2)
    },
    destroyed() {
      this.crud.unregisterVM("pagination", this)
    }
  }
}

/**
 * 表单
 */
function form(defaultForm) {
  return {
    data() {
      return {
        crud: this.crud,
        form: this.crud.form
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM("form", this, 3)
    },
    created() {
      this.crud.defaultForm = defaultForm
      this.crud.resetForm()
    },
    destroyed() {
      this.crud.unregisterVM("form", this)
    }
  }
}

/**
 * crud
 */
function crud(options = {}) {
  const defaultOptions = {
    type: undefined
  }
  options = mergeOptions(defaultOptions, options)
  return {
    data() {
      return {
        crud: this.crud
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM(options.type, this)
    },
    destroyed() {
      this.crud.unregisterVM(options.type, this)
    }
  }
}

/**
 * CRUD钩子
 */
CRUD.HOOK = {
  /** 刷新 - 之前 */
  beforeRefresh: "beforeCrudRefresh",
  /** 刷新 - 之后 */
  afterRefresh: "afterCrudRefresh",
  /** 删除 - 之前 */
  beforeDelete: "beforeCrudDelete",
  /** 删除 - 之后 */
  afterDelete: "afterCrudDelete",
  /** 删除取消 - 之前 */
  beforeDeleteCancel: "beforeCrudDeleteCancel",
  /** 删除取消 - 之后 */
  afterDeleteCancel: "afterCrudDeleteCancel",
  /** 新建 - 之前 */
  beforeToAdd: "beforeCrudToAdd",
  /** 新建 - 之后 */
  afterToAdd: "afterCrudToAdd",
  /** 详情 - 之前 */
  beforeToInfo: "beforeCrudToInfo",
  /** 详情 - 之后 */
  afterToInfo: "afterCrudToInfo",
  /** 编辑 - 之前 */
  beforeToEdit: "beforeCrudToEdit",
  /** 编辑 - 之后 */
  afterToEdit: "afterCrudToEdit",
  /** 开始 "新建/编辑" - 之前 */
  beforeToCU: "beforeCrudToCU",
  /** 开始 "新建/编辑" - 之后 */
  afterToCU: "afterCrudToCU",
  /** "新建/编辑" 验证 - 之前 */
  beforeValidateCU: "beforeCrudValidateCU",
  /** "新建/编辑" 验证 - 之后 */
  afterValidateCU: "afterCrudValidateCU",
  /** 添加取消 - 之前 */
  beforeAddCancel: "beforeCrudAddCancel",
  /** 添加取消 - 之后 */
  afterAddCancel: "afterCrudAddCancel",
  /** 详情取消 - 之前 */
  beforeInfoCancel: "beforeCrudInfoCancel",
  /** 详情取消 - 之后 */
  afterInfoCancel: "afterCrudInfoCancel",
  /** 编辑取消 - 之前 */
  beforeEditCancel: "beforeCrudEditCancel",
  /** 编辑取消 - 之后 */
  afterEditCancel: "afterCrudEditCancel",
  /** 提交 - 之前 */
  beforeSubmit: "beforeCrudSubmitCU",
  /** 提交 - 之后 */
  afterSubmit: "afterCrudSubmitCU",
  afterAddError: "afterCrudAddError",
  afterEditError: "afterCrudEditError"
}

/**
 * CRUD状态
 */
CRUD.STATUS = {
  NORMAL: 0,
  PREPARED: 1,
  PROCESSING: 2
}

/**
 * CRUD通知类型
 */
CRUD.NOTIFICATION_TYPE = {
  SUCCESS: "success",
  WARNING: "warning",
  INFO: "info",
  ERROR: "error"
}

export default CRUD

export { presenter, header, form, pagination, crud }
