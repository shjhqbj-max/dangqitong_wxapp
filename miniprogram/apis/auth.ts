import { api, USE_MOCK } from '../utils/request'
import type { ApiResponse } from '../utils/request'

export interface UserInfo {
  id: string
  nickName: string
  avatarUrl: string
  phoneNumber: string
}

export interface LoginResult {
  token: string
  userInfo: UserInfo
}

/**
 * 通过手机号 code 登录
 * @param phoneCode 微信 getPhoneNumber 返回的 code
 */
export function loginByPhoneCode(phoneCode: string): Promise<ApiResponse<LoginResult>> {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      data: {
        token: 'mock_token_' + Date.now(),
        userInfo: {
          id: '10001',
          nickName: '微信用户',
          avatarUrl: '',
          phoneNumber: '138****8888'
        }
      }
    })
  }
  return api.post('/api/auth/login/phone', { phoneCode })
}

/**
 * 获取当前登录用户信息
 */
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    const token = wx.getStorageSync('token')
    if (!token) {
      return Promise.resolve({ code: 401, data: null as any, message: '未登录' })
    }
    return Promise.resolve({
      code: 200,
      data: {
        id: '10001',
        nickName: '微信用户',
        avatarUrl: '',
        phoneNumber: '138****8888'
      }
    })
  }
  return api.get('/api/auth/userinfo')
}
