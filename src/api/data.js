import { method } from "@/utils/request"

export function initData(url, params, baseURL = process.env.VUE_APP_API_URL) {
  return method(baseURL)({
    url: url,
    data: params,
    method: "post"
  })
}
