// DQT Mock 数据 — 个人资料
import { UserProfile } from './types'

export const mockProfile: UserProfile = {
  user_id: 'u-001',
  nickname: '摄影老王',
  avatar_url: '',
  city: '杭州',
  professions: ['摄影', '摄像'],
  price_desc: '2880元/场',
  phone: '13800138001',
  wechat_id: 'wang_photo',
  bio: '专注婚礼摄影8年，杭州本地团队，提供婚礼跟拍、婚纱照、航拍等服务。',
  created_at: '2024-03-15T10:00:00'
}

export function getProfile(): UserProfile {
  return mockProfile
}
