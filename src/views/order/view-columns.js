export const selectGoodsColumns = [
  {
    title: "货品名称",
    dataIndex: "goodsName",
    width: "22%",
    key: "goodsName"
  },
  {
    title: "货品编号",
    dataIndex: "goodsNo",
    width: "20%",
    key: "goodsNo"
  },
  {
    title: "货品规格",
    width: "10%",
    dataIndex: "goodsSpecification",
    key: "goodsSpecification"
  },
  {
    title: "货品总重",
    width: "12%",
    // dataIndex: "goodsWeight",
    key: "goodsWeight",
    scopedSlots: { customRender: "goodsWeight" }
  },
  {
    title: "货品总件数",
    // dataIndex: "goodsNum",
    width: "12%",
    key: "goodsNum",
    scopedSlots: { customRender: "goodsNum" }
  },
  {
    title: "备注",
    // dataIndex: "goodsNote",
    key: "goodsNote",
    scopedSlots: { customRender: "goodsNote" }
  }
]

export const selectOrderColumns = [
  {
    title: "单号",
    dataIndex: "orderNo",
    width: 90,
    align: "center",
    key: "orderNo"
  },
  {
    title: "收货单位",
    dataIndex: "receiveName",
    width: 120,
    align: "center",
    ellipsis: true,
    key: "receiveName"
  },
  {
    title: "发货单位",
    width: 120,
    align: "center",
    ellipsis: true,
    dataIndex: "originName",
    key: "originName"
  },
  {
    title: "货品",
    width: 100,
    align: "center",
    dataIndex: "goodsName",
    key: "goodsName",
    ellipsis: true
  },
  {
    title: "编号",
    dataIndex: "goodsNo",
    width: 70,
    align: "center",
    key: "goodsNo",
    ellipsis: true
  },
  {
    title: "余量",
    dataIndex: "goodsMargin",
    width: 50,
    align: "center",
    key: "goodsMargin",
    ellipsis: true
  },
  {
    title: "规格",
    dataIndex: "goodsSpecification",
    width: 50,
    align: "center",
    key: "goodsSpecification",
    ellipsis: true
  },
  {
    title: "件数",
    dataIndex: "goodsNum",
    width: 50,
    align: "center",
    key: "goodsNum",
    ellipsis: true
  },
  {
    title: "备注",
    dataIndex: "goodsNote",
    width: 80,
    align: "center",
    key: "goodsNote",
    ellipsis: true
  },
  {
    title: "装车量",
    // dataIndex: "goodsLoadQuantity",
    width: 150,
    align: "center",
    key: "goodsLoadQuantity",
    fixed: "right",
    scopedSlots: { customRender: "goodsLoadQuantity" }
  }

  // {
  //   title: "备注",
  //   // dataIndex: "goodsNote",
  //   key: "goodsNote",
  //   scopedSlots: { customRender: "goodsNote" }
  // }
]

export const selectVehicleColumns = [
  {
    title: "车牌号",
    dataIndex: "vehicleNumber",
    width: 90,
    align: "center",
    key: "vehicleNumber"
  },
  {
    title: "司机姓名",
    dataIndex: "driverName",
    width: 90,
    align: "center",
    ellipsis: true,
    key: "driverName"
  },
  {
    title: "司机手机号",
    width: 120,
    align: "center",
    ellipsis: true,
    dataIndex: "tel",
    key: "tel"
  },
  {
    title: "限重",
    width: 100,
    align: "center",
    dataIndex: "limitTotalLoad",
    key: "limitTotalLoad",
    ellipsis: true
  },
  {
    title: "车身长",
    dataIndex: "length",
    width: 70,
    align: "center",
    key: "length",
    ellipsis: true
  }
]

export const selectTruckOrderGoodsColumns = [
  {
    title: "货品名称",
    dataIndex: "goodsName",
    width: "22%",
    align: "center",
    key: "goodsName"
  },
  {
    title: "货品编号",
    dataIndex: "goodsNo",
    width: "20%",
    align: "center",
    key: "goodsNo"
  },
  {
    title: "货品规格",
    width: "10%",
    align: "center",
    dataIndex: "goodsSpecification",
    key: "goodsSpecification"
  },
  {
    title: "装车重量",
    width: "12%",
    align: "center",
    key: "goodsLoadQuantity",
    dataIndex: "goodsLoadQuantity"
  },
  {
    title: "货品总件数",
    dataIndex: "goodsNum",
    width: "12%",
    align: "center",
    key: "goodsNum"
  },
  {
    title: "备注",
    align: "center",
    dataIndex: "goodsNote",
    key: "goodsNote"
  }
]
