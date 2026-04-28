import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { UserProfile } from '../mock/types'
import * as mockProfile from '../mock/profile'

// 获取个人资料
export function getProfile(): Promise<ApiResponse<UserProfile>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockProfile.getProfile() })
  }
  return api.get('/api/profile')
}

// 修改个人资料
export function updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.put('/api/profile', data)
}
