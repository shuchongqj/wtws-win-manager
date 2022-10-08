<template>
  <div class="list">
    <div v-for="it in dataList" :key="it.dateStr" class="item">
      <div class="date">
        <span>{{ it.day }}</span
        >/{{ it.mounth }}月/{{ it.year }}年
      </div>
      <div v-for="i in it.items" :key="i.insertTime" class="_it">
        <div class="_l">{{ i.time }}</div>
        <div class="_c">
          <div class="_circle"></div>
        </div>
        <div class="_r">
          <div class="_t">{{ i.content }}</div>
          <div class="_b"></div>
        </div>

        <div
          v-for="(itemImage, index) in i.imagesContent"
          :key="index"
          style="margin-left: 10px"
        >
          <el-image
            :preview-src-list="[itemImage.url]"
            :src="itemImage.url"
            style="width: 100px; height: 100px"
          >
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { entryTypeMap, operationType, storageTypeMap } from "@/utils/utils.js"

export default {
  data() {
    return {
      dataList: []
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    list: {
      handler(val) {
        let dataList = []
        Array.isArray(val) &&
          val.forEach(it => {
            const date = this.getDate(it.insertTime)
            const dateStr = date.join("-")
            if (dataList.filter(it => it.dateStr === dateStr).length === 0) {
              dataList.push({
                dateStr,
                date,
                day: date[2],
                mounth: date[1],
                year: date[0],
                items: [this.resolveData(it)]
              })
            } else {
              dataList.forEach(i => {
                i.dateStr === dateStr && i.items.push(this.resolveData(it))
              })
            }
          })
        this.dataList = dataList
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getDate(insertTime) {
      let dateArr = insertTime.split(" ")
      if (dateArr.length == 1) {
        dateArr = insertTime.split("T")
      }
      return dateArr[0].split("-")
    },
    getTime(insertTime) {
      let timeArr = insertTime.split(" ")
      if (timeArr.length == 1) {
        timeArr = insertTime.split("T")
        timeArr[1] = timeArr[1].replace(/:\d{2}\+\d{2}/, "")
      }
      let time = timeArr[1]
      let arr = time.split(":")
      arr.pop()
      return arr.join(":")
    },
    resolveData(it) {
      let obj = {
        operationID: it.operationID,
        time: this.getTime(it.insertTime),
        insertTime: it.insertTime
      }
      if (
        it.imagesContent &&
        typeof it.imagesContent === "object" &&
        it.imagesContent.length &&
        it.imagesContent.length > 0
      ) {
        obj.imagesContent = it.imagesContent.filter(
          item => Object.keys(item).length > 0
        )
      } else {
        obj.imagesContent = []
      }

      if (it.operationContent && typeof it.operationContent === "string") {
        it.operationContent = JSON.parse(it.operationContent)
      }

      switch (it.operationType) {
        case 1:
          // eslint-disable-next-line no-case-declarations
          let wheelPosition = it.operationContent.wheelPosition
          if (!wheelPosition) {
            let operationContent = it.operationContent
            if (typeof it.operationContent == "string") {
              operationContent = JSON.parse(it.operationContent)
              if (operationContent && operationContent.wheelPosition) {
                wheelPosition = operationContent.wheelPosition
              }
            }
          }
          obj.content = `${operationType[it.operationType]} （${
            it.vehicleNumber
          }-${wheelPosition}）`
          break
        case 10:
          obj.content = `${operationType[it.operationType]} （${
            it.operationContent.startLW.wheelPosition
          }->${it.operationContent.endLW.wheelPosition}）`
          break
        case 9:
          obj.content = `${operationType[it.operationType]}`
          if (it.operationContent.note) {
            obj.content += `  (${it.operationContent.note})`
          }
          break
        case 29:
          obj.content = `${operationType[it.operationType]}  --  ${
            entryTypeMap[it.entryType]
          }  --  ${storageTypeMap[it.storageType]}`
          break
        case 32:
          obj.content = `${operationType[it.operationType]}`
          console.log(
            `it.operationContent : ${JSON.stringify(it.operationContent)}`
          )
          if (it.operationContent.saleOrderType) {
            obj.content += `  --  ${
              it.operationContent.saleOrderType == 0 ? "线上订单" : "线下订单"
            }`
          }
          if (it.operationContent.saleOrderSn) {
            obj.content += `  --  [订单号:${it.operationContent.saleOrderSn}]`
          }
          if (it.operationContent.vehicleNumber) {
            obj.content += `  --  (安装车牌:${it.operationContent.vehicleNumber})`
          }
          break
        default:
          obj.content = `${operationType[it.operationType]}`
          break
      }
      return obj
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  .item {
    padding-top: 17px;
    padding-bottom: 13px;
    border-bottom: 1px solid #e8e8e8;

    &:last-child {
      border: none;
      margin-bottom: 10px;
    }

    .date {
      height: 24px;
      font-size: 14px;
      font-weight: 400;
      color: #232323;
      line-height: 24px;

      text {
        font-size: 17px;
      }

      margin-bottom: 13px;
    }

    ._it {
      display: flex;
      align-items: flex-start;

      &:last-child {
        ._r {
          &::before {
            display: none;
          }
        }
      }

      ._l {
        height: 21px;
        width: 51px;
        font-size: 15px;
        font-weight: 400;
        color: #5d5d5d;
        line-height: 21px;
        margin-right: 8px;
      }

      ._c {
        width: 7px;
        flex: 0 0 7px;
        height: auto;
        margin-right: 9px;
        position: relative;

        ._circle {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1px solid #afafaf;
          box-sizing: border-box;
          margin-top: 7.5px;
        }
      }

      ._r {
        flex: 1;
        position: relative;
        height: 100px;

        &::before {
          content: "";
          display: block;
          width: 1px;
          height: calc(100% - 7px);
          position: absolute;
          left: -13px;
          // transform: translateX(-50%);
          top: 14px;
          box-sizing: border-box;
          border-left: 1px dashed #d3d3d3;
        }

        ._t {
          height: 21px;
          font-size: 15px;
          font-weight: 400;
          color: #232323;
          line-height: 21px;

          text {
            display: inline-block;
            margin-left: 10px;
            color: #474747;
            font-size: 12px;
          }
        }

        ._b {
          margin-top: 5.5px;
          margin-bottom: 11.5px;
          font-size: 15px;
          height: 15px;
          font-weight: 400;
          color: #a6a6a6;
          line-height: 21px;
        }
      }
    }
  }
}
</style>
