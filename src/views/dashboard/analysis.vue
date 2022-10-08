<!--
 * @Description: 
 * @Author: yuyongjie
 * @Date: 2020-12-20 16:25:23
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-29 19:43:26
-->
<template>
  <div class="page">
    <template>
      <a-radio-group
        v-model="dateType"
        button-style="solid"
        style="padding-bottom: 18px;"
        @change="changeDateType"
      >
        <a-radio-button value="day">日</a-radio-button>
        <a-radio-button value="month">月</a-radio-button>
        <a-radio-button value="year">年</a-radio-button>
      </a-radio-group>
    </template>

    <div class="top-card">
      <a-card class="card card1" hoverable @click="clickCard('采购单')">
        <template slot="title">
          <div class="title">
            采购单
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{ dataObj.purchaseOrder.total }}
              </span>
              <span></span>
            </div>
            <div class="_r">
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      dataObj.purchaseOrder.addPercentage < 0 ? 'reduce' : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (dataObj.purchaseOrder.addPercentage * 100).toFixed(2)
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>

      <a-card class="card card1" hoverable @click="clickCard('销售单')">
        <template slot="title">
          <div class="title">
            销售单
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{ dataObj.saleOrder.total }}
              </span>
              <span></span>
            </div>
            <div class="_r">
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      dataObj.saleOrder.addPercentage < 0 ? 'reduce' : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (dataObj.saleOrder.addPercentage * 100).toFixed(2)
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>

      <a-card class="card card1" hoverable @click="clickCard('直发/倒短单')">
        <template slot="title">
          <div class="title">
            直发单
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{ dataObj.sentDirectOrder.total }}
              </span>
              <span></span>
            </div>
            <div class="_r">
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      dataObj.sentDirectOrder.addPercentage < 0
                        ? 'reduce'
                        : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (dataObj.sentDirectOrder.addPercentage * 100).toFixed(
                          2
                        )
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>

      <a-card class="card card1" hoverable @click="clickCard('派车单')">
        <template slot="title">
          <div class="title">
            派车单
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{ dataObj.truckOrder.total }}
              </span>
              <span></span>
            </div>
            <div class="_r">
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      dataObj.truckOrder.addPercentage < 0 ? 'reduce' : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (dataObj.truckOrder.addPercentage * 100).toFixed(2)
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>

      <a-card class="card card1" hoverable @click="clickCard('过磅单')">
        <template slot="title">
          <div class="title">
            过磅单
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{ dataObj.weighOrder.total }}
              </span>
              <span></span>
            </div>
            <div class="_r">
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      dataObj.weighOrder.addPercentage < 0 ? 'reduce' : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (dataObj.weighOrder.addPercentage * 100).toFixed(2)
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>
    </div>

    <div class="middle">
      <a-card class="card1" hoverable title="各类型订单数据比对">
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t"></div>
          <div ref="chart4" style="width:96%;height:306px"></div>
        </div>
      </a-card>
      <a-card class="card2" hoverable title="派车单各状态数据">
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t"></div>
          <div ref="chart5" style="width:96%;height:306px"></div>
        </div>
      </a-card>

      <a-card class="card3" hoverable title="过磅单各状态数据">
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t"></div>
          <div ref="chart6" style="width:96%;height:306px"></div>
        </div>
      </a-card>
    </div>

    <div class="bottom-card">
      <a-card :title="currentOrderType" class="card1" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t"></div>
          <div ref="chart3" style="width:96%;height:376px"></div>
        </div>
      </a-card>

      <a-card :title="currentOrderType" class="card2" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t"></div>
          <div ref="chart7" style="width:96%;height:376px"></div>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
import Api from "@/api/analysis"
import { parseTime, splitNum } from "@/utils/utils"
import echarts from "echarts"

export default {
  data() {
    return {
      splitNum,
      parseTime,
      currentOrderType: "",
      dateType: "month",
      dataObj: {
        purchaseOrder: {
          total: 0,
          lastTotal: 0,
          addPercentage: 0,
          wait: 0,
          checked: 0,
          reject: 0,
          failure: 0,
          finish: 0,
          hasTruck: 0
        },
        saleOrder: {
          total: 0,
          lastTotal: 0,
          addPercentage: 0,
          wait: 0,
          checked: 0,
          reject: 0,
          failure: 0,
          finish: 0,
          hasTruck: 0
        },
        sentDirectOrder: {
          total: 0,
          lastTotal: 0,
          addPercentage: 0,
          wait: 0,
          checked: 0,
          reject: 0,
          failure: 0,
          finish: 0,
          hasTruck: 0
        },
        truckOrder: {
          total: 0,
          lastTotal: 0,
          addPercentage: 0,
          wait: 0,
          checked: 0,
          reject: 0,
          failure: 0,
          finish: 0
        },
        weighOrder: {
          total: 0,
          lastTotal: 0,
          addPercentage: 0,
          process: 0,
          failure: 0,
          wareHouseCheck: 0,
          waitFinish: 0,
          finish: 0
        }
      },
      orderDataObj: {}
    }
  },
  computed: {},
  mounted() {
    this.initData()
  },
  methods: {
    async getAnalysis() {
      const dateType = this.dateType
      const orderType = this.currentOrderType
      const [analysisDetailRes, analysisOrderDetailRes] = await Promise.all([
        Api.analysisDetail({ dateType }),
        Api.analysisOrderTypeDetail({
          dateType,
          orderType
        })
      ])
      if (analysisDetailRes.code === 0) {
        this.dataObj = analysisDetailRes.result
      }
      if (analysisOrderDetailRes.code === 0) {
        this.orderDataObj = analysisOrderDetailRes.result
      }
      this.drawChart3()
      this.drawChart4()
      this.drawChart5()
      this.drawChart6()
      this.drawChart7()
    },
    async initData() {
      this.currentOrderType = "采购单"
      await this.getAnalysis()
    },
    drawChart3() {
      const option = {
        color: [
          "#3B7AFC",
          "#FF6730",
          "#F2B101",
          "#6DD400",
          "#47F4CD",
          "#3DC8FF"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: [],
          selected: []
        },
        series: [
          {
            name: "订单状态",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["40%", "50%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }

      const analyData = this.dataObj
      const orderType = this.currentOrderType
      let data = []
      let legendData = []

      switch (orderType) {
        case "采购单":
          legendData = [
            "等待审核",
            "审核通过",
            "审核驳回",
            "已派车",
            "失效",
            "结束"
          ]
          data = [
            { name: "等待审核", value: analyData.purchaseOrder.wait },
            { name: "审核通过", value: analyData.purchaseOrder.checked },
            { name: "审核驳回", value: analyData.purchaseOrder.reject },
            { name: "已派车", value: analyData.purchaseOrder.hasTruck },
            { name: "失效", value: analyData.purchaseOrder.failure },
            { name: "结束", value: analyData.purchaseOrder.finish }
          ]
          break
        case "销售单":
          data = [
            { name: "等待审核", value: analyData.saleOrder.wait },
            { name: "审核通过", value: analyData.saleOrder.checked },
            { name: "审核驳回", value: analyData.saleOrder.reject },
            { name: "已派车", value: analyData.saleOrder.hasTruck },
            { name: "失效", value: analyData.saleOrder.failure },
            { name: "结束", value: analyData.saleOrder.finish }
          ]
          break
        case "直发/倒短单":
          data = [
            { name: "等待审核", value: analyData.sentDirectOrder.wait },
            { name: "审核通过", value: analyData.sentDirectOrder.checked },
            { name: "审核驳回", value: analyData.sentDirectOrder.reject },
            { name: "已派车", value: analyData.sentDirectOrder.hasTruck },
            { name: "失效", value: analyData.sentDirectOrder.failure },
            { name: "结束", value: analyData.sentDirectOrder.finish }
          ]
          break
        case "派车单":
          legendData = ["等待审核", "审核通过", "审核驳回", "失效", "结束"]
          data = [
            { name: "等待审核", value: analyData.truckOrder.wait },
            { name: "审核通过", value: analyData.truckOrder.checked },
            { name: "审核驳回", value: analyData.truckOrder.reject },
            { name: "失效", value: analyData.truckOrder.failure },
            { name: "结束", value: analyData.truckOrder.finish }
          ]
          break
        case "过磅单":
          legendData = ["运输中", "失效", "仓库确认", "等待完成", "结束"]
          data = [
            { name: "运输中", value: analyData.weighOrder.process },
            { name: "失效", value: analyData.weighOrder.failure },
            { name: "仓库确认", value: analyData.weighOrder.wareHouseCheck },
            { name: "等待完成", value: analyData.weighOrder.waitFinish },
            { name: "结束", value: analyData.weighOrder.finish }
          ]
          break
      }

      option.legend.data = legendData
      option.series[0].data = data
      // 初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["chart3"])
      // 绘制图表
      myChart.setOption(option)
    },
    drawChart4() {
      const data = this.dataObj
      let myChart = this.$echarts.init(this.$refs["chart4"])
      const option = {
        backgroundColor: "#fff",
        grid: {
          top: "20%",
          right: "10%",
          left: "10%",
          bottom: "12%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        dataset: {
          dimensions: [
            "status",
            "等待审核",
            "审核通过",
            "审核驳回",
            "已派车",
            "失效",
            "结束"
          ],
          source: [
            {
              status: "采购单",
              等待审核: data.purchaseOrder.wait,
              审核通过: data.purchaseOrder.checked,
              审核驳回: data.purchaseOrder.reject,
              已派车: data.purchaseOrder.hasTruck,
              失效: data.purchaseOrder.failure,
              结束: data.purchaseOrder.finish
            },
            {
              status: "销售单",
              等待审核: data.saleOrder.wait,
              审核通过: data.saleOrder.checked,
              审核驳回: data.saleOrder.reject,
              已派车: data.saleOrder.hasTruck,
              失效: data.saleOrder.failure,
              结束: data.saleOrder.finish
            },
            {
              status: "直发/倒短单",
              等待审核: data.sentDirectOrder.wait,
              审核通过: data.sentDirectOrder.checked,
              审核驳回: data.sentDirectOrder.reject,
              已派车: data.sentDirectOrder.hasTruck,
              失效: data.sentDirectOrder.failure,
              结束: data.sentDirectOrder.finish
            }
          ]
        },
        legend: {
          data: ["等待审核", "审核通过", "审核驳回", "已派车", "失效", "结束"]
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: false },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            color: "#2F2E2EFF",
            axisLabel: {
              margin: 20,
              color: "#DADADA",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(173,183,255,1)"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              formatter: "{value}",
              color: "#AFAFAF",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#948f04" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#0546b0" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#16a603" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#028274" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#e20707" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#039ea6" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          }
        ]
      }

      myChart.setOption(option)
    },
    drawChart5() {
      const data = this.dataObj
      let myChart = this.$echarts.init(this.$refs["chart5"])
      const option = {
        backgroundColor: "#fff",
        grid: {
          top: "20%",
          right: "10%",
          left: "10%",
          bottom: "12%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        dataset: {
          dimensions: [
            "status",
            "等待审核",
            "审核通过",
            "审核驳回",
            "失效",
            "结束"
          ],
          source: [
            {
              status: "派车单",
              等待审核: data.truckOrder.wait,
              审核通过: data.truckOrder.checked,
              审核驳回: data.truckOrder.reject,
              失效: data.truckOrder.failure,
              结束: data.truckOrder.finish
            }
          ]
        },
        legend: {
          data: ["等待审核", "审核通过", "审核驳回", "失效", "结束"]
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: false },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            color: "#2F2E2EFF",
            axisLabel: {
              margin: 20,
              color: "#DADADA",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(173,183,255,1)"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              formatter: "{value}",
              color: "#AFAFAF",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#0546b0" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#16a603" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#028274" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#e20707" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#039ea6" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          }
        ]
      }

      myChart.setOption(option)
    },
    drawChart6() {
      const data = this.dataObj
      let myChart = this.$echarts.init(this.$refs["chart6"])
      const option = {
        backgroundColor: "#fff",
        grid: {
          top: "20%",
          right: "10%",
          left: "10%",
          bottom: "12%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        dataset: {
          dimensions: [
            "status",
            "运输中",
            "失效",
            "仓库确认",
            "等待完成",
            "结束"
          ],
          source: [
            {
              status: "过磅单",
              运输中: data.weighOrder.process,
              仓库确认: data.weighOrder.wareHouseCheck,
              失效: data.weighOrder.failure,
              等待完成: data.weighOrder.waitFinish,
              结束: data.weighOrder.finish
            }
          ]
        },
        legend: {
          data: ["运输中", "失效", "仓库确认", "等待完成", "结束"]
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: false },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            color: "#2F2E2EFF",
            axisLabel: {
              margin: 20,
              color: "#DADADA",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(173,183,255,1)"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              formatter: "{value}",
              color: "#AFAFAF",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#0546b0" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#16a603" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#028274" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#e20707" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          },
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#C3E8FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#039ea6" // 100% 处的颜色
                  }
                ],
                false
              ),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#6d6d6d",
                position: "top"
              }
            }
          }
        ]
      }

      myChart.setOption(option)
    },
    drawChart7() {
      const option = {
        backgroundColor: "#fff",
        grid: {
          top: "20%",
          right: "10%",
          left: "10%",
          bottom: "12%"
        },
        xAxis: [
          {
            type: "category",
            color: "#AFAFAF",
            data: [],
            axisLabel: {
              // formatter: "{value}月",
              margin: 20,
              color: "#DADADA",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(173,183,255,1)"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              // formatter: "{value}",
              color: "#AFAFAF",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: [],
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: function() {
                  //展示正值的柱子，负数设为透明
                  let colorArr = ["#C3E8FF", "#112AF8"]
                  return new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: colorArr[0] // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: colorArr[1] // 100% 处的颜色
                      }
                    ],
                    false
                  )
                },
                barBorderRadius: [30, 30, 0, 0]
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#AFAFAF",
                position: "top"
              }
            }
          },
          {
            data: [],
            type: "line",
            smooth: true,
            name: "折线图",
            symbol: "none",
            lineStyle: {
              color: "#ADB7FF",
              width: 4,
              shadowColor: "rgba(0, 0, 0, 0.3)", //设置折线阴影
              shadowBlur: 15,
              shadowOffsetY: 20
            }
          }
        ]
      }

      const orderDataObj = this.orderDataObj

      let data = Object.values(orderDataObj)
      let legendData = Object.keys(orderDataObj)

      console.log(`data : ${JSON.stringify(data)}`)
      console.log(`legendData : ${JSON.stringify(legendData)}`)

      option.xAxis[0].data = legendData
      option.series[0].data = data
      option.series[1].data = data

      const myChart = this.$echarts.init(this.$refs["chart7"])
      myChart.setOption(option)
    },
    async clickCard(title) {
      this.currentOrderType = title
      await this.getAnalysis()
    },
    async changeDateType() {
      await this.getAnalysis()
      this.drawChart4()
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  overflow-x: auto;
}

.top-card {
  min-width: 1156px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card {
    margin-right: 18px;
    // height: 232px;
    &:last-child {
      margin-right: 0;
    }

    flex: 1;
    min-width: 275px;
    border: none;
    border-radius: 10px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);

    /deep/ .ant-card-head,
    /deep/ .ant-card-body {
      padding-left: 19px;
      padding-right: 19px;
    }

    /deep/ .ant-card-head {
      .ant-card-head-title {
        padding: 0;
      }

      .title {
        height: 30px;
        font-size: 22px;
        font-weight: 500;
        text-align: left;
        color: #3d3d3d;
        line-height: 30px;
      }

      .ant-card-extra {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #afafaf;
      }
    }

    /deep/ .ant-card-body {
      padding-top: 12px;
      padding-bottom: 16px;

      ._content {
        ._top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          // margin-bottom: 18px;
          ._l {
            display: flex;
            align-items: center;

            span {
              display: block;

              &:first-child {
                height: 47px;
                font-size: 40px;
                font-weight: 700;
                text-align: left;
                color: #3d3d3d;
                line-height: 47px;
                letter-spacing: 2px;
              }

              &:last-child {
                height: 20px;
                font-size: 14px;
                font-weight: 400;
                text-align: left;
                color: #afafaf;
                line-height: 20px;
                margin-top: 10px;
                margin-left: 9px;
              }
            }
          }

          ._r {
            & > div {
              &.HB {
                margin-top: 9px;
              }

              display: flex;
              align-items: center;

              ._title {
                height: 20px;
                font-size: 14px;
                font-weight: 400;
                text-align: left;
                color: #afafaf;
                line-height: 20px;
                margin-right: 22px;
              }
            }
          }
        }
      }
    }

    &.card1 {
      .ant-card-body {
        ._content {
          ._top {
            ._r {
              & > div {
                &.HB {
                  ._right {
                    span {
                      display: flex;
                      align-items: center;

                      & > * {
                        display: block;
                      }

                      span {
                        &:last-child {
                          margin-left: -8px;
                        }
                      }

                      &.add {
                        span {
                          color: #ff4343;

                          &:first-child {
                            width: 0;
                            height: 0;
                            border-left: 9px solid transparent;
                            border-right: 9px solid transparent;
                            border-bottom: 10px solid red;
                          }
                        }
                      }

                      &.reduce {
                        span {
                          color: #05c065;

                          &:first-child {
                            width: 0;
                            height: 0;
                            border-left: 9px solid transparent;
                            border-right: 9px solid transparent;
                            border-top: 10px solid #05c065;
                          }
                        }
                      }
                    }
                  }
                }

                ._right {
                  span {
                    &:last-child {
                      color: #afafaf;
                    }
                  }
                }
              }

              ._right {
                display: flex;
                align-items: center;

                span {
                  display: block;
                  max-width: 58px;

                  &:first-child {
                    height: 22px;
                    font-size: 16px;
                    font-weight: 500;
                    text-align: left;
                    color: #3b3b3b;
                    line-height: 22px;
                    margin-right: 16px;
                  }

                  &:last-child {
                    height: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: left;
                    color: #6f7fff;
                    line-height: 20px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.middle {
  margin-top: 24px;
  min-width: 1156px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .card1 {
    border: none;
    border-radius: 10px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    margin-bottom: 10px;
    width: 45%;
    height: 400px;
  }

  .card2 {
    border: none;
    border-radius: 10px;
    margin-left: 15px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    margin-bottom: 10px;
    width: 26%;
    height: 400px;
  }

  .card3 {
    border: none;
    border-radius: 10px;
    margin-left: 15px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    margin-bottom: 10px;
    width: 26%;
    height: 400px;
  }
}

.bottom-card {
  margin-top: 24px;
  min-width: 1156px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .card1 {
    border: none;
    border-radius: 10px;
    margin-left: 10px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    margin-bottom: 10px;
    width: 40%;
    height: 450px;
  }

  .card2 {
    border: none;
    border-radius: 10px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    margin-bottom: 10px;
    width: 57%;
    height: 450px;
  }

  .card {
    border: none;
    border-radius: 10px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    margin-bottom: 10px;

    /deep/ .ant-card-head {
      .ant-card-head-title {
        font-size: 22px;
        font-weight: 500;
        text-align: left;
        color: #3d3d3d;
      }

      .ant-card-extra {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #afafaf;
      }
    }

    ._box {
      position: relative;
      overflow: hidden;

      ._t {
        position: absolute;
        left: 18px;
        top: -5px;
        display: flex;
        align-items: center;
        z-index: 88;

        & > div,
        &.last > ._l > div {
          display: flex;
          align-items: flex-end;

          &.HB {
            display: flex;
            align-items: center;
            margin-top: 13px;
            margin-left: 15px;
            margin-right: 15px;

            ._title {
              height: 20px;
              font-size: 14px;
              font-weight: 400;
              text-align: left;
              color: #afafaf;
              line-height: 20px;
              margin-right: 22px;
            }

            ._right {
              span {
                display: flex;
                align-items: center;

                & > * {
                  display: block;
                }

                span {
                  &:last-child {
                    margin-left: -8px;
                  }
                }

                &.add {
                  span {
                    color: #ff4343;

                    &:first-child {
                      width: 0;
                      height: 0;
                      border-left: 9px solid transparent;
                      border-right: 9px solid transparent;
                      border-bottom: 10px solid red;
                      position: relative;
                      left: -15px;
                    }
                  }
                }

                &.reduce {
                  span {
                    color: #05c065;

                    &:first-child {
                      width: 0;
                      height: 0;
                      border-left: 9px solid transparent;
                      border-right: 9px solid transparent;
                      border-top: 10px solid #05c065;
                      position: relative;
                      left: -15px;
                    }
                  }
                }
              }
            }
          }
        }

        span {
          font-size: 14px;
          font-weight: 400;
          color: #afafaf;
          display: block;

          &.b {
            color: #6f7fff;
            font-size: 22px;
            font-weight: 500;
            margin: 0 7px;
          }
        }
      }

      ._t.last {
        justify-content: space-between;
        width: 95%;

        & > div {
          display: flex;
          align-items: center;
          justify-content: space-between;

          &._r {
            display: block !important;

            & > div {
              margin-bottom: 12px;

              &:last-child {
                margin-bottom: 0;
              }

              color: #afafaf;
              display: flex;
              align-items: center;

              span {
                color: #3b3b3b;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }

  & > * {
    width: calc(50% - 9px);

    &:first-child {
      margin-right: 18px;
    }
  }
}
</style>
