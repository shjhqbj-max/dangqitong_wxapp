// DQT Mock 数据 — 档期卡
import { ScheduleCard } from './types'

const mockCards: Record<string, ScheduleCard> = {
  'u-001': {
    card_id: 'c-001',
    user_id: 'u-001',
    nickname: '我自己',
    avatar_url: 'https://i.pravatar.cc/150?img=11',
    profession: '摄影',
    city: '杭州',
    phone: '13800138001',
    bio: '5年婚礼跟拍经验，擅长纪实风格，杭州本地团队核心摄影师。',
    price_text: '2,500/天',
    background_url: '',
    schedules: [
      { date: '2026-04-28', title: '婚礼跟拍', location: '杭州西湖区' },
      { date: '2026-05-03', title: '商业活动', location: '上海浦东新区' },
      { date: '2026-05-10', title: '婚礼跟拍', location: '杭州余杭区' }
    ],
    updated_at: '2026-04-26T10:00:00',
    qr_code_url: ''
  },
  'u-002': {
    card_id: 'c-002',
    user_id: 'u-002',
    nickname: '张三',
    avatar_url: 'https://i.pravatar.cc/150?img=12',
    profession: '摄像',
    city: '杭州',
    phone: '13800138002',
    bio: '专业婚礼摄像，4K拍摄，无人机航拍。',
    price_text: '3,000/天',
    background_url: '',
    schedules: [
      { date: '2026-04-28', title: '婚礼摄像', location: '杭州西湖区' },
      { date: '2026-05-01', title: '企业年会', location: '杭州滨江区' }
    ],
    updated_at: '2026-04-25T16:00:00',
    qr_code_url: ''
  },
  'u-003': {
    card_id: 'c-003',
    user_id: 'u-003',
    nickname: '李四',
    avatar_url: 'https://i.pravatar.cc/150?img=13',
    profession: '摄影',
    city: '杭州',
    phone: '13800138003',
    bio: '专注人像与婚礼摄影，风格清新自然。',
    price_text: '2,000/天',
    background_url: '',
    schedules: [
      { date: '2026-05-02', title: '婚纱摄影', location: '杭州西湖区' }
    ],
    updated_at: '2026-04-24T09:00:00',
    qr_code_url: ''
  },
  'u-004': {
    card_id: 'c-004',
    user_id: 'u-004',
    nickname: '王五',
    avatar_url: 'https://i.pravatar.cc/150?img=14',
    profession: '化妆',
    city: '杭州',
    phone: '13800138004',
    bio: '高级化妆造型师，新娘妆/晚宴妆/舞台妆均擅长。',
    price_text: '1,800/天',
    background_url: '',
    schedules: [
      { date: '2026-04-29', title: '新娘跟妆', location: '杭州拱墅区' },
      { date: '2026-05-05', title: '活动化妆', location: '杭州上城区' }
    ],
    updated_at: '2026-04-26T08:00:00',
    qr_code_url: ''
  },
  'u-005': {
    card_id: 'c-005',
    user_id: 'u-005',
    nickname: '赵六',
    avatar_url: 'https://i.pravatar.cc/150?img=15',
    profession: '摄像',
    city: '杭州',
    phone: '13800138005',
    bio: '影视级航拍+地面摄像，提供完整后期服务。',
    price_text: '3,500/天',
    background_url: '',
    schedules: [],
    updated_at: '2026-04-23T14:00:00',
    qr_code_url: ''
  },
  'u-006': {
    card_id: 'c-006',
    user_id: 'u-006',
    nickname: '孙七',
    avatar_url: 'https://i.pravatar.cc/150?img=16',
    profession: '灯光',
    city: '杭州',
    phone: '13800138006',
    bio: '专业婚礼灯光搭建，LED帕灯/追光灯/光束灯。',
    price_text: '1,500/天',
    background_url: '',
    schedules: [
      { date: '2026-04-28', title: '婚礼灯光', location: '杭州西湖区' }
    ],
    updated_at: '2026-04-25T11:00:00',
    qr_code_url: ''
  },
  'u-007': {
    card_id: 'c-007',
    user_id: 'u-007',
    nickname: '周八',
    avatar_url: 'https://i.pravatar.cc/150?img=20',
    profession: '化妆',
    city: '上海',
    phone: '13900139001',
    bio: '10年新娘妆经验，上海知名化妆造型团队创始人。',
    price_text: '2,800/天',
    background_url: '',
    schedules: [
      { date: '2026-04-30', title: '新娘跟妆', location: '上海静安区' },
      { date: '2026-05-02', title: '商业活动', location: '上海浦东新区' },
      { date: '2026-05-08', title: '婚礼跟妆', location: '上海黄浦区' }
    ],
    updated_at: '2026-04-26T09:00:00',
    qr_code_url: ''
  },
  'u-008': {
    card_id: 'c-008',
    user_id: 'u-008',
    nickname: '吴九',
    avatar_url: 'https://i.pravatar.cc/150?img=21',
    profession: '花艺',
    city: '上海',
    phone: '13900139002',
    bio: '婚礼花艺设计，手捧/胸花/拱门/桌花全系列。',
    price_text: '价格详聊',
    background_url: '',
    schedules: [
      { date: '2026-05-01', title: '婚礼花艺', location: '上海徐汇区' }
    ],
    updated_at: '2026-04-25T15:00:00',
    qr_code_url: ''
  },
  'u-009': {
    card_id: 'c-009',
    user_id: 'u-009',
    nickname: '郑十',
    avatar_url: 'https://i.pravatar.cc/150?img=22',
    profession: '摄影',
    city: '上海',
    phone: '13900139003',
    bio: '纪实婚礼摄影，用镜头记录每一个真实瞬间。',
    price_text: '2,200/天',
    background_url: '',
    schedules: [
      { date: '2026-05-06', title: '婚礼跟拍', location: '上海浦东新区' },
      { date: '2026-05-12', title: '婚纱摄影', location: '上海松江区' }
    ],
    updated_at: '2026-04-24T17:00:00',
    qr_code_url: ''
  },
  'u-010': {
    card_id: 'c-010',
    user_id: 'u-010',
    nickname: '冯十一',
    avatar_url: 'https://i.pravatar.cc/150?img=23',
    profession: '主持',
    city: '上海',
    phone: '13900139004',
    bio: '婚礼/活动主持人，台风稳健，幽默风趣。',
    price_text: '1,500/场',
    background_url: '',
    schedules: [
      { date: '2026-05-01', title: '婚礼主持', location: '上海静安区' }
    ],
    updated_at: '2026-04-26T07:00:00',
    qr_code_url: ''
  }
}

// 获取指定用户的档期卡
export function getScheduleCard(userId: string): ScheduleCard | null {
  return mockCards[userId] || null
}

// 获取档期卡图片（mock 返回空字符串）
export function getCardImage(_userId: string): { image_url: string } {
  return { image_url: '' }
}
