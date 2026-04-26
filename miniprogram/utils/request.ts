// 统一请求封装
export interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

const BASE_URL = ''
export const USE_MOCK = true

function request<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  const fullUrl = `${BASE_URL}${url}`
  console.log(`[Request] ${method} ${fullUrl}`, data || '')

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data,
      header: { 'Content-Type': 'application/json' },
      timeout: 10000,
      success: (res) => {
        console.log(`[Response] ${method} ${fullUrl} status=${res.statusCode}`, res.data)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as ApiResponse<T>)
        } else {
          wx.showToast({ title: `请求失败 ${res.statusCode}`, icon: 'none' })
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail: (err) => {
        console.error(`[Request Failed] ${method} ${fullUrl}`, err)
        wx.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

export const api = {
  get: <T = any>(url: string, data?: any) => request<T>('GET', url, data),
  post: <T = any>(url: string, data?: any) => request<T>('POST', url, data),
  put: <T = any>(url: string, data?: any) => request<T>('PUT', url, data),
  delete: <T = any>(url: string, data?: any) => request<T>('DELETE', url, data),
}