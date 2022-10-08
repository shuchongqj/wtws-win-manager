import Mock from "mockjs2"
import { builder } from "../util"

const info = () => {
  // role
  const roleObj = [
    {
      children: [
        {
          children: null,
          description: "",
          functionCode: "1072",
          functionID: "2efb4e14b44942009fbc90e2e821920b",
          functionIcon: "",
          functionMethod: "",
          functionName: "商机管理",
          functionType: 1,
          isValid: 0,
          parentFunctionCode: "107",
          path: ""
        },
        {
          children: null,
          description: "",
          functionCode: "1071",
          functionID: "c2c0e5645c884acc8dc661b5e1d7299f",
          functionIcon: "",
          functionMethod: "",
          functionName: "销售人员查询",
          functionType: 1,
          isValid: 0,
          parentFunctionCode: "107",
          path: ""
        }
      ],
      description: "",
      functionCode: "107",
      functionID: "0b034f2160a942e095fa6ab1116eb1c6",
      functionIcon: "",
      functionMethod: "",
      functionName: "销售管理",
      functionType: 0,
      isValid: 0,
      parentFunctionCode: "0",
      path: ""
    }
  ]

  return builder(roleObj)
}

Mock.mock(/\/user\/getRoleFunctionByRoleID/, "post", info)
