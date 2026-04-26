import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { Chat, Message, Notification } from '../mock/types'
import * as mockChat from '../mock/chat'

// 获取聊天会话列表
export function getChatList(): Promise<ApiResponse<Chat[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockChat.getChats() })
  }
  return api.get('/api/chats')
}

// 获取系统通知列表
export function getNotifications(): Promise<ApiResponse<Notification[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockChat.getNotifications() })
  }
  return api.get('/api/notifications')
}

// 获取聊天消息列表
export function getMessages(chatId: string): Promise<ApiResponse<Message[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockChat.getMessages(chatId) })
  }
  return api.get('/api/chats/' + chatId + '/messages')
}

// 发送消息
export function sendMessage(chatId: string, data: { msg_type: string; content: string }): Promise<ApiResponse<Message>> {
  if (USE_MOCK) {
    var msg: Message = {
      message_id: 'm-new-' + Date.now(),
      sender_id: 'u-001',
      sender_name: '我自己',
      sender_avatar: 'https://i.pravatar.cc/150?img=11',
      msg_type: data.msg_type as 'text' | 'image' | 'location' | 'system',
      content: data.content,
      sent_at: new Date().toISOString()
    }
    return Promise.resolve({ code: 200, data: msg })
  }
  return api.post('/api/chats/' + chatId + '/messages', data)
}

// 标记通知已读
export function markRead(notificationId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.put('/api/notifications/' + notificationId + '/read')
}

// 创建聊天会话
export function createChat(params: {
  chat_type: 'team' | 'schedule_temp'
  chat_name: string
  schedule_id?: string
  team_id?: string
  member_ids: string[]
  expire_at?: string
}): Promise<ApiResponse<Chat>> {
  if (USE_MOCK) {
    var chat = mockChat.createChat(params)
    return Promise.resolve({ code: 200, data: chat })
  }
  return api.post('/api/chats', params)
}

// 添加成员到群聊
export function addMember(chatId: string, userId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    mockChat.addMemberToChat(chatId, userId)
    return Promise.resolve({ code: 200, data: null })
  }
  return api.post('/api/chats/' + chatId + '/members', { user_id: userId })
}

// 从群聊移除成员
export function removeMember(chatId: string, userId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    mockChat.removeMemberFromChat(chatId, userId)
    return Promise.resolve({ code: 200, data: null })
  }
  return api.delete('/api/chats/' + chatId + '/members/' + userId)
}

// 关闭聊天会话
export function closeChat(chatId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    mockChat.closeChat(chatId)
    return Promise.resolve({ code: 200, data: null })
  }
  return api.delete('/api/chats/' + chatId)
}
