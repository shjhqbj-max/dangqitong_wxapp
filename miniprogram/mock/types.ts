// DQT Mock 数据类型定义（对应 API 规范）

// ====== 用户 ======
export interface UserProfile {
  user_id: string
  nickname: string
  avatar_url: string
  city: string
  professions: string[]
  price_desc: string
  phone: string
  wechat_id: string
  bio: string
  created_at: string
}

// ====== 档期 ======
export interface Schedule {
  id: string
  date: string
  start_time: string
  end_time: string
  status: 'confirmed' | 'pending' | 'rest'
  completion_status: 'completed' | 'uncompleted' | 'delayed' | ''
  source: string
  location: string
  contact_name: string
  contact_phone: string
  extra_contacts?: ExtraContact[]
  total_price: number
  paid_amount: number
  payment_status: 'paid' | 'unpaid' | 'partial' | ''
  notes: string
  assigned_member_ids?: string[]
  photos?: string[]
  created_at: string
}

export interface ExtraContact {
  role: string
  name: string
  phone: string
}

export interface CalendarDay {
  statuses: string[]
  count: number
}

export interface CalendarDayMap {
  [date: string]: CalendarDay
}

// ====== 团队 ======
export interface Team {
  team_id: string
  name: string
  logo_url: string
  description: string
  city: string
  service_types: string[]
  contact_phone: string
  member_count: number
  my_role: 'admin' | 'member'
  created_at: string
}

export interface TeamMember {
  user_id: string
  nickname: string
  avatar_url: string
  professions: string[]
  role: 'admin' | 'member'
  can_dispatch: boolean
  joined_at: string
}

export interface TeamScheduleItem {
  user_id: string
  nickname: string
  avatar_url: string
  professions: string[]
  status: 'confirmed' | 'pending' | 'rest' | 'free'
  start_time?: string
  end_time?: string
  location?: string
}

// ====== 工单 ======
export interface Order {
  order_id: string
  title: string
  date: string
  start_time: string
  end_time: string
  location: string
  profession: string
  price: number
  description: string
  status: 'active' | 'grabbed' | 'closed' | 'completed'
  publisher: {
    user_id: string
    nickname: string
    avatar_url: string
  }
  grab_count: number
  deadline: string
  created_at: string
  contact?: string
  photos?: string[]
  from_team_name?: string | null
  my_grab_status?: 'pending' | 'rejected' | 'accepted' | 'completed'
  grabbers?: Array<{
    user_id: string
    nickname: string
    avatar_url: string
    professions: string[]
    city: string
    grabbed_at: string
  }>
}

// ====== 聊天 ======
export interface Chat {
  chat_id: string
  chat_name: string
  schedule_id: string
  member_count: number
  last_message: {
    sender_name: string
    content: string
    sent_at: string
  } | null
  unread_count: number
  created_at: string
}

export interface Message {
  message_id: string
  sender_id: string
  sender_name: string
  sender_avatar: string
  msg_type: 'text' | 'image' | 'location'
  content: string
  sent_at: string
}

// ====== 通知 ======
export interface Notification {
  notification_id: string
  type: string
  title: string
  content: string
  extra_data: Record<string, string>
  is_read: boolean
  created_at: string
}

// ====== 档期卡 ======
export interface CardSchedule {
  date: string
  title: string
  location: string
}

export interface CardWork {
  image_url: string
  title?: string
}

export interface ScheduleCard {
  card_id: string
  user_id: string
  nickname: string
  avatar_url: string
  profession: string
  city: string
  phone: string
  bio: string
  price_text: string
  background_url: string
  schedules: CardSchedule[]
  works: CardWork[]
  updated_at: string
  qr_code_url: string
}
