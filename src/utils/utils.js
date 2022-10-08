const OSS = require("ali-oss")

// Html转义符转换成普通
export function unescapeHTML(str) {
  var arrEntities = {
    lt: "<",
    gt: ">",
    nbsp: " ",
    amp: "&",
    quot: '"'
  }
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(all, t) {
    return arrEntities[t]
  })
}

export function escapeHTML(sHtml) {
  return sHtml.replace(/[<>&"]/g, function(c) {
    return {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;"
    }[c]
  })
}

// 时间段
export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9
    ? "早上好"
    : hour <= 11
    ? "上午好"
    : hour <= 13
    ? "中午好"
    : hour < 20
    ? "下午好"
    : "晚上好"
}

// 时间戳转换
export function timeStampToDate(timestamp) {
  let timestamps = eval("new " + timestamp.replace(/\//g, ""))
  var YY = timestamps.getFullYear() + "-"
  var MM =
    (timestamps.getMonth() + 1 < 10
      ? "0" + (timestamps.getMonth() + 1)
      : timestamps.getMonth() + 1) + "-"
  var DD =
    timestamps.getDate() < 10
      ? "0" + timestamps.getDate()
      : timestamps.getDate()
  var hh =
    (timestamps.getHours() < 10
      ? "0" + timestamps.getHours()
      : timestamps.getHours()) + ":"
  var mm =
    (timestamps.getMinutes() < 10
      ? "0" + timestamps.getMinutes()
      : timestamps.getMinutes()) + ":"
  var ss =
    timestamps.getSeconds() < 10
      ? "0" + timestamps.getSeconds()
      : timestamps.getSeconds()
  return YY + MM + DD + " " + hh + mm + ss
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}"
  let date
  if (typeof time === "undefined" || time === null || time === "null") {
    return ""
  } else if (typeof time === "object") {
    date = time
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value]
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value
    }
    return value || 0
  })
  return time_str
}

export function fileLengthFormat(limit) {
  var size = ""
  if (limit < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(2) + "B"
  } else if (limit < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + "KB"
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB"
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
  }

  var sizeStr = size + "" //转成字符串
  var index = sizeStr.indexOf(".") //获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
  if (dou == "00") {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement("a")
  link.style.display = "none"
  link.href = url
  const fileName = parseTime(new Date()) + "-" + name + "." + suffix
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function downloadFileByUrl(url, fileName) {
  const request = new XMLHttpRequest()
  request.responseType = "blob"
  request.onload = function() {
    const url = window.URL.createObjectURL(this.response)
    const a = document.createElement("a")
    document.body.appendChild(a)
    a.href = url
    a.download = fileName
    a.click()
    document.body.removeChild(a)
  }
  request.open("GET", url)
  request.send()
}

// 判断是否ie
export function isIE() {
  const bw = window.navigator.userAgent
  const compare = s => bw.indexOf(s) >= 0
  const ie11 = (() => "ActiveXObject" in window)()
  return compare("MSIE") || ie11
}

// 处理地理位置返回信息
export const handleMapData = map => {
  console.log(map)
  return {
    provinceId: map.regeocode.addressComponent.adcode.substr(0, 2) + "0000",
    provinceName: map.regeocode.addressComponent.province,
    cityId: map.regeocode.addressComponent.adcode.substr(0, 4) + "00",
    cityName: map.regeocode.addressComponent.city
      ? map.regeocode.addressComponent.city
      : map.regeocode.addressComponent.province,
    areaId: map.regeocode.addressComponent.adcode,
    areaName: map.regeocode.addressComponent.district
      ? map.regeocode.addressComponent.district
      : map.regeocode.addressComponent.township
  }
}

// 图片上传
export const uploadFile = (hash, file, fileType) => {
  return new Promise(resolve => {
    const client = new OSS({
      region: "oss-cn-qingdao",
      accessKeyId: "LTAI4G5u7yNLs7JajAYnmGD5",
      accessKeySecret: "CYU7qhuCvVFMEP6mG06qUZjoxo3HIy",
      bucket: "hurricane-image",
      secure: true
    })
    ;(async () => {
      try {
        let result = await client.put(
          "hurricane-image/enterpriseImage/" + hash + fileType,
          file
        )
        resolve(result)
      } catch (e) {
        console.log(e)
      }
    })()
  })
}

export const splitNum = num => {
  if (!isNaN(Number(num))) {
    return Number(num)
  } else {
    return Number(num.replace(/,/g, ""))
  }
}

// 轮胎作业 轮胎作业类型：1-轮胎安装 2-花纹检测  3-卸下备用 4-卸下修理 5-卸下翻新 6-卸下报废 7-卸下待检 8-维护-修补 9-维护-例检 10-维护-换位   11-维护-动平衡 12-维护翻面 13-维护-气压调整 14-维护-换氮气 15-维护-车轮清洁 16-维修结果登记-修理成功  17-维修结果登记-修理失败  18-备用 19-修理 20-报废处理
export const operationType = {
  0: "轮胎入库",
  1: "轮胎安装",
  2: "花纹检测",
  3: "卸下备用",
  4: "卸下修理",
  5: "卸下翻新",
  6: "卸下报废",
  7: "卸下待检",
  8: "维护-修补",
  9: "维护-例检",
  10: "维护-换位",
  11: "维护-动平衡",
  12: "维护-翻面",
  13: "维护-气压调整",
  14: "维护-换氮气",
  15: "维护-车轮清洁",
  16: "维修结果登记-修理成功",
  17: "维修结果登记-修理失败",
  18: "备用",
  19: "修理",
  20: "报废处理",
  21: "轮毂安装",
  22: "更换轮胎",
  23: "更换轮毂",
  24: "轮胎换位",
  25: "气压调整",
  26: "卡客车轮胎修补",
  27: "更换气门嘴",
  28: "其他",
  29: "入库",
  30: "出库",
  31: "销售出库-选择轮胎",
  32: "销售出库-轮胎安装",
  33: "销售出库-退回轮胎",
  34: "耗材入库",
  35: "销售出库-选择耗材",
  36: "销售出库-耗材安装",
  37: "销售出库-退回耗材",
  38: "轮胎维修-使用耗材"
}

export const entryTypeMap = {
  1: "表格导入",
  2: "工具导入"
}

export const storageTypeMap = {
  1: "新胎入库",
  2: "回收胎入库",
  3: "调度胎入库",
  4: "翻新胎入库"
}

// 2022-09-07T08:54:44+08:00  类型字符串解析
export const fullTimeFilter = timeFullStr => {
  if (!timeFullStr) {
    return "-"
  }
  const timeObj = new Date(timeFullStr)
  return (
    (timeObj.getFullYear() < 1000
      ? "000" + timeObj.getFullYear()
      : timeObj.getFullYear()) +
    "-" +
    (timeObj.getMonth() + 1 >= 10
      ? timeObj.getMonth() + 1
      : "0" + (timeObj.getMonth() + 1)) +
    "-" +
    (timeObj.getDate() >= 10 ? timeObj.getDate() : "0" + timeObj.getDate()) +
    "  " +
    (timeObj.getHours() >= 10 ? timeObj.getHours() : "0" + timeObj.getHours()) +
    ":" +
    (timeObj.getMinutes() >= 10
      ? timeObj.getMinutes()
      : "0" + timeObj.getMinutes()) +
    ":" +
    (timeObj.getSeconds() >= 10
      ? timeObj.getSeconds()
      : "0" + timeObj.getSeconds())
  )
}

export const filterMapSearch = (value, option) =>
  option.componentOptions.children[0].text.indexOf(value) >= 0
