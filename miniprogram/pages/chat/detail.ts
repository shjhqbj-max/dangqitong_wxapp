// 聊天详情页
import authGuard from '../../behaviors/auth-guard'
import * as chatApi from '../../apis/chat'
import { Message, Chat } from '../../mock/types'

interface DisplayMessage extends Message {
  isSelf: boolean
  showTime: boolean
}

Page({
  behaviors: [authGuard],

  data: {
    chatId: '',
    chatName: '',
    messages: [] as DisplayMessage[],
    inputValue: '',
    scrollTop: 0
  },

  onLoad(options: any) {
    const chatId = options.chatId || ''
    this.setData({ chatId })
    this.loadData()
  },

  async loadData() {
    const { chatId } = this.data
    if (!chatId) return

    // 获取会话名称
    const chatRes = await chatApi.getChatList()
    if (chatRes.code === 200) {
      const chat = chatRes.data.find((c: Chat) => c.chat_id === chatId)
      if (chat) {
        this.setData({ chatName: chat.chat_name })
        wx.setNavigationBarTitle({ title: chat.chat_name })
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
  }
})
