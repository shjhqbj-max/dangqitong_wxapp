// 聊天详情页
import authGuard from '../../behaviors/auth-guard'
import * as chatApi from '../../apis/chat'
import * as scheduleApi from '../../apis/schedule'
import * as teamApi from '../../apis/team'
import { Message, Chat, Schedule, TeamMember } from '../../mock/types'

interface DisplayMessage extends Message {
  isSelf: boolean
  showTime: boolean
}

Page({
  behaviors: [authGuard],

  data: {
    chatId: '',
    chatName: '',
    chatType: '' as Chat['chat_type'],
    memberCount: 0,
    scheduleInfo: null as Schedule | null,
    members: [] as TeamMember[],
    showMemberPanel: false,
    teamId: '',
    teamStats: { total: 0, done: 0, pending: 0 },
    messages: [] as DisplayMessage[],
    inputValue: '',
    scrollTop: 0,
    keyboardHeight: 0,
    inputFocused: false
  },

  _keyboardHandler: null as WechatMiniprogram.OnKeyboardHeightChangeCallback | null,

  onLoad(options: any) {
    const chatId = options.chatId || ''
    console.log(chatId);
    
    this.setData({ chatId })
    this.loadData()

    this._keyboardHandler = (res) => {
      this.setData({ keyboardHeight: res.height })
    }
    wx.onKeyboardHeightChange(this._keyboardHandler)
  },

  onUnload() {
    if (this._keyboardHandler) {
      wx.offKeyboardHeightChange(this._keyboardHandler)
    }
  },

  async loadData() {
    const { chatId } = this.data
    if (!chatId) return

    // 获取会话信息
    const chatRes = await chatApi.getChatList()
    if (chatRes.code === 200) {
      const chat = chatRes.data.find((c: Chat) => c.chat_id === chatId)
      if (chat) {
        this.setData({
          chatName: chat.chat_name,
          chatType: chat.chat_type,
          memberCount: chat.member_count,
          teamId: chat.team_id
        })
        wx.setNavigationBarTitle({ title: chat.chat_name })
        if (chat.chat_type === 'schedule_temp' && chat.schedule_id) {
          const schRes = await scheduleApi.getScheduleDetail(chat.schedule_id)
          if (schRes.code === 200) {
            this.setData({ scheduleInfo: schRes.data })
          }
        }
      }
    }

    // 获取消息
    const msgRes = await chatApi.getMessages(chatId)
    if (msgRes.code === 200) {
      const list: DisplayMessage[] = msgRes.data.map((msg: Message, i: number) => {
        const prev = i > 0 ? msgRes.data[i - 1] : null
        const showTime = !prev || this.diffMinutes(prev.sent_at, msg.sent_at) > 5
        return Object.assign({}, msg, {
          isSelf: msg.sender_id === 'u-001',
          showTime
        })
      })
      this.setData({ messages: list })
      this.scrollToBottom()
    }

    // 获取群成员
    if (this.data.chatType !== 'private') {
      const memRes = await chatApi.getChatMembers(chatId)
      if (memRes.code === 200) {
        this.setData({ members: memRes.data })
      }
    }

    // 团队群：获取本月档期统计
    if (this.data.chatType === 'team' && this.data.teamId) {
      var now = new Date()
      var monthStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
      const schRes = await teamApi.getTeamSchedule(this.data.teamId, monthStr)
      if (schRes.code === 200) {
        var total = schRes.data.length
        var done = 0
        var pending = 0
        for (var i = 0; i < schRes.data.length; i++) {
          if (schRes.data[i].status === 'confirmed') done++
          else if (schRes.data[i].status === 'pending') pending++
        }
        this.setData({ teamStats: { total: total, done: done, pending: pending } })
      }
    }
  },

  diffMinutes(a: string, b: string): number {
    const da = new Date(a).getTime()
    const db = new Date(b).getTime()
    return Math.abs(db - da) / 60000
  },

  scrollToBottom() {
    setTimeout(() => {
      this.setData({ scrollTop: 999999 })
    }, 100)
  },

  onInput(e: any) {
    this.setData({ inputValue: e.detail.value })
  },

  onInputFocus() {
    this.setData({ inputFocused: true })
  },

  onInputBlur() {
    this.setData({ inputFocused: false, keyboardHeight: 0 })
  },

  async onSendText() {
    const content = this.data.inputValue.trim()
    if (!content) return

    this.setData({ inputValue: '' })
    const res = await chatApi.sendMessage(this.data.chatId, { msg_type: 'text', content })
    if (res.code === 200) {
      const msg: DisplayMessage = Object.assign({}, res.data, {
        isSelf: true,
        showTime: this.shouldShowTime()
      })
      this.setData({ messages: this.data.messages.concat([msg]) })
      this.scrollToBottom()
    }
  },

  onSendImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFile = res.tempFiles[0]
        if (!tempFile) return
        const result = await chatApi.sendMessage(this.data.chatId, {
          msg_type: 'image',
          content: tempFile.tempFilePath
        })
        if (result.code === 200) {
          const msg: DisplayMessage = Object.assign({}, result.data, {
            isSelf: true,
            showTime: this.shouldShowTime()
          })
          this.setData({ messages: this.data.messages.concat([msg]) })
          this.scrollToBottom()
        }
      }
    })
  },

  onSendLocation() {
    wx.chooseLocation({
      success: async (res) => {
        const addr = res.name || res.address || '未知位置'
        const result = await chatApi.sendMessage(this.data.chatId, {
          msg_type: 'location',
          content: addr
        })
        if (result.code === 200) {
          const msg: DisplayMessage = Object.assign({}, result.data, {
            isSelf: true,
            showTime: this.shouldShowTime()
          })
          this.setData({ messages: this.data.messages.concat([msg]) })
          this.scrollToBottom()
        }
      }
    })
  },

  shouldShowTime(): boolean {
    const msgs = this.data.messages
    if (msgs.length === 0) return true
    const last = msgs[msgs.length - 1]
    return this.diffMinutes(last.sent_at, new Date().toISOString()) > 5
  },

  onPreviewImage(e: any) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({ urls: [src], current: src })
  },

  onOpenLocation(e: any) {
    wx.showToast({ title: e.currentTarget.dataset.addr, icon: 'none' })
  },

  onMemberTap(e: any) {
    var uid = e.currentTarget.dataset.uid
    if (uid) {
      this.setData({ showMemberPanel: false })
      wx.navigateTo({ url: '/pages/team/card?userId=' + uid })
    }
  },

  onToggleMemberPanel() {
    this.setData({ showMemberPanel: !this.data.showMemberPanel })
  },

  onGoTeamProfile() {
    if (this.data.teamId) {
      wx.navigateTo({ url: '/pages/team/profile?teamId=' + this.data.teamId })
    }
  }
})
