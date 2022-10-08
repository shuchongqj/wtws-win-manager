<template>
  <a-modal
    :title="title"
    wrapClassName="mapDialog"
    :visible.sync="mapVisible"
    width="70%"
    @cancel="handleClose"
  >
    <div :style="{ padding: type === 'info' ? '0!important' : '24px' }">
      <div class="_l" v-if="type !== 'info'">
        <a-form ref="form" class="map-drag-form" laba-width="100px">
          <a-form-item label="选择模式：">
            <a-radio-group v-model="dragModle">
              <a-radio
                v-for="item in dragModleList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</a-radio
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item label="选地结果：">
            <div style="margin-bottom: 10px;">
              <span class="font-blod">经纬度：</span>{{ lngitude }},{{
                latitude
              }}
            </div>
            <div><span class="font-blod">地址：</span>{{ address }}</div>
          </a-form-item>
        </a-form>
      </div>

      <div
        class="_r"
        :style="{ width: type === 'info' ? '100%!important' : '65%' }"
      >
        <div class="searchinfo" v-if="type !== 'info'">
          <div class="input-item">
            <div class="input-item-prepend">
              <span class="input-item-text" style="width:8rem;"
                >请输入关键字：</span
              >
            </div>
            <a-input id="tipinput" v-model="keyword"></a-input>
          </div>
        </div>
        <div
          style="height:100%"
          id="dragContainer"
          v-if="mapVisible"
          tabindex="0"
        ></div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <a-button @click="closeDialog('cancel')" type="info">取 消</a-button>
      <a-button @click="closeDialog('confirm')" type="primary">确 定</a-button>
    </span>
  </a-modal>
</template>

<script>
import AMap from "AMap"
import AMapUI from "AMapUI"
import { handleMapData } from "@/utils/utils"
export default {
  name: "mapDrag",
  data() {
    return {
      map: null,
      geolocation: null,
      positionPicker: null,
      dragModleList: [
        { label: "拖拽Marker模式", value: "dragMarker" },
        { label: "拖拽地图模式", value: "dragMap" }
      ],
      dragModle: "dragMap",
      lngitude: this.lng,
      latitude: this.lat,
      address: "",
      position: "",
      keyword: ""
    }
  },
  props: {
    mapVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "选择地点"
    },
    lng: {
      type: String,
      default: ""
    },
    lat: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      /**
       * choose 为选择模式 info 为查看模式
       */
      default() {
        return "choose"
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  watch: {
    mapVisible: {
      handler() {
        this.$nextTick(() => {
          this.initMap()
        })
      },
      deep: true
    },
    dragModle(newVal) {
      this.positionPicker.setMode(newVal)
    }
  },
  methods: {
    initMap() {
      const _this = this
      // eslint-disable-next-line no-unused-vars
      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        // 基础配置
        let mapconfig = {
          mapStyle: "amap://styles/9870b774a725a19a5af9366c12f092a0", // 样式URL,
          resizeEnable: true,
          zoom: 18,
          lang: "zh"
        }

        if (_this.lng !== "" && _this.lat !== "") {
          mapconfig.center = [parseFloat(_this.lng), parseFloat(_this.lat)]
        }

        _this.map = new AMap.Map("dragContainer", mapconfig)

        if (_this.lng !== "" && _this.lat !== "" && _this.type === "info") {
          var marker = new AMap.Marker({
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: mapconfig.center
          })
          _this.map.add(marker)
        }

        // 异步加载插件
        AMap.plugin(
          [
            "AMap.ToolBar",
            "AMap.Scale",
            "AMap.Autocomplete",
            "AMap.PlaceSearch"
          ],
          function() {
            _this.map.addControl(new AMap.ToolBar())
            _this.map.addControl(new AMap.Scale())
            if (_this.type !== "info") {
              var autoOptions = {
                // city 限定城市，默认全国
                city: "全国",
                input: "tipinput"
              }
              var autoComplete = new AMap.Autocomplete(autoOptions)
              var placeSearch = new AMap.PlaceSearch({
                city: "全国",
                map: _this.map
              })
              AMap.event.addListener(autoComplete, "select", function(e) {
                // 针对选中的poi实现自己的功能
                placeSearch.search(e.poi.name)
              })
            }
          }
        )

        // 获取定位信息
        if (_this.lng === "" && _this.lat === "") {
          AMap.plugin(["AMap.Geolocation"], function() {
            _this.geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              timeout: 10000, // 超过10秒后停止定位，默认：无穷大
              buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: false, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              buttonPosition: "RB",
              noGeoLocation: 0,
              noIpLocate: 0
            })
            _this.map.addControl(_this.geolocation)
            _this.geolocation.getCurrentPosition()
            AMap.event.addListener(
              _this.geolocation,
              "complete",
              _this.onComplete
            ) // 返回定位信息
            AMap.event.addListener(_this.geolocation, "error", _this.onError) // 返回定位出错信息
          })
        }

        if (_this.type === "choose") {
          // 拖拽
          _this.positionPicker = new PositionPicker({
            mode: "dragMap",
            map: _this.map,
            iconStyle: {
              // 自定义外观
              url: "//webapi.amap.com/ui/1.0/assets/position-picker2.png", // 图片地址
              size: [48, 48], // 要显示的点大小，将缩放图片
              ancher: [24, 40] // 锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
            }
          })
          _this.positionPicker.on("success", positionResult => {
            _this.setLocalData(positionResult)
          })
          // eslint-disable-next-line no-unused-vars
          _this.positionPicker.on("fail", positionResult => {})
          _this.positionPicker.start()
        }
      })
    },
    handleClose() {
      this.$emit("update:mapVisible", false)
      this.map.destroy()
    },
    closeDialog(status) {
      if (status === "confirm") {
        this.$emit("update:mapVisible", false)
        this.$emit("update:lng", this.lngitude.toString())
        this.$emit("update:lat", this.latitude.toString())
        this.$emit("getLocation", {
          data: {
            lng: this.lngitude,
            lat: this.latitude,
            address: this.address,
            position: handleMapData(this.position)
          },
          status: status
        })
        this.map.destroy()
      } else {
        this.$emit("update:mapVisible", false)
        this.$emit("getLocation", {
          data: {},
          status: status
        })
        this.map.destroy()
      }
      this.keyword = ""
    },
    // 定位完成
    // eslint-disable-next-line no-unused-vars
    onComplete(e) {},
    // 定位失败
    onError() {},
    // 取值
    setLocalData(position) {
      this.address = position.address
      this.lngitude = position.position.lng
      this.latitude = position.position.lat
      this.position = position
    }
  }
}
</script>

<style lang="scss">
.amap-sug-result {
  z-index: 3000;
  border: none;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.35);
  .auto-item {
    font-size: 12px;
    padding: 0 11px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
    height: 28px;
    line-height: 28px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0);
    .auto-item-span {
      color: #333;
    }
    &:hover {
      background-color: #e5e5e5;
    }
  }
}
.mapDialog {
  .map-drag-form {
    .a-form-item {
      margin-bottom: 0;
      .a-form-item__label {
        float: none;
      }
      .a-form-item__content {
        margin-left: 0.17rem !important;
        color: #333;
        line-height: 24px;
      }
    }
    .a-radio {
      display: block;
      margin: 11px 0;
    }
    .a-radio__label {
      padding-left: 21px;
    }
  }
  .a-dialog__body {
    padding: 10px 20px;
  }
  .searchinfo {
    // display: none;
    padding: 13px 12px;
    border-radius: 2px;
    position: absolute;
    top: 15px;
    background-color: white;
    width: auto;
    min-width: 400px;
    border-width: 0;
    right: 15px;
    z-index: 2999;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    color: #333;
    .input-item {
      display: flex;
      align-items: center;
    }
    .input-item-prepend {
      display: inline-block;
      width: 200px;
    }
    .input-item:last-child {
      margin-bottom: 0;
    }
    .a-input {
      width: 64%;
      margin-left: 10px;
      #tipinput {
        width: 100%;
        display: inline-block;
        height: 36px;
        line-height: 36px;
        border: 1px solid #999999;
        border-radius: 2px;
        background-color: rgba(0, 0, 0, 0);
        color: #333;
      }
    }
  }
}
</style>
