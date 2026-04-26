// 成员管理页
import authGuard from '../../behaviors/auth-guard'
import * as teamApi from '../../apis/team'
import * as chatApi from '../../apis/chat'
import { Team, TeamMember } from '../../mock/types'

Page({
  behaviors: [authGuard],
  data: {
    teamId: '',
    team: null as Team | null,
    members: [] as TeamMember[],
    isAdmin: false,
    isCreateMode: false,
    inviteCode: '',
    actionIdx: -1
  },

  onLoad(options: any) {
    const teamId = options.teamId || ''
    this.setData({
      teamId,
      isCreateMode: !teamId
    })
    if (teamId) {
      this.loadData()
    }
  },

  async loadData() {
    const res = await teamApi.getMyTeams()
    if (res.code !== 200) {
      wx.showToast({ title: '加载失败', icon: 'none' })
      return
    }
    const team = res.data.find((t: Team) => t.team_id === this.data.teamId) || null
    if (!team) return
    const mRes = await teamApi.getTeamMembers(this.data.teamId)
    const members = mRes.code === 200 ? mRes.data : []
    this.setData({
      team,
      members,
      isAdmin: team.my_role === 'admin',
      inviteCode: team.team_id.toUpperCase()
    })
  },

  onMemberAction(e: any) {
    const idx = e.currentTarget.dataset.idx
    const member = this.data.members[idx]
    if (member.user_id === 'u-001') return

    const items = member.role === 'admin'
      ? ['取消管理员', '移出团队']
      : ['设为管理员', '移出团队']

    wx.showActionSheet({
      itemList: items,
      success: async (res) => {
        if (res.tapIndex === 0) {
          const newRole = member.role === 'admin' ? 'member' : 'admin'
          try {
            const r = await teamApi.updateMemberRole(this.data.teamId, member.user_id, newRole)
            if (r.code === 200) {
              wx.showToast({ title: '已更新', icon: 'none' })
              this.loadData()
            } else {
              wx.showToast({ title: '操作失败', icon: 'none' })
            }
          } catch (e) {
            wx.showToast({ title: '网络错误', icon: 'none' })
          }
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '确认移除',
            content: '确定将「' + member.nickname + '」移出团队？',
            success: async (modal) => {
              if (!modal.confirm) return
              try {
                const r = await teamApi.removeMember(this.data.teamId, member.user_id)
                if (r.code === 200) {
                  wx.showToast({ title: '已移除', icon: 'none' })
                  // 从团队群移除
                  this._syncRemoveFromTeamChat(member.user_id)
                  this.loadData()
                } else {
                  wx.showToast({ title: '移除失败', icon: 'none' })
                }
              } catch (e) {
                wx.showToast({ title: '网络错误', icon: 'none' })
              }
            }
          })
        }
      }
    })
  },

  onCopyInvite() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => wx.showToast({ title: '已复制', icon: 'none' })
    })
  },

  onShareInvite() {
    this.setData({ sharePending: true })
    wx.showToast({ title: '点击右上角转发', icon: 'none' })
  },

  onShareAppMessage() {
    var teamId = this.data.teamId
    var teamName = this.data.team ? this.data.team.name : '我的团队'
    return {
      title: '邀请你加入「' + teamName + '」',
      path: '/pages/team/list?inviteTeam=' + teamId
    }
  },

  onEditName() {
    var curName = this.data.team ? this.data.team.name : ''
    wx.navigateTo({
      url: '/pages/common/input?title=' + encodeURIComponent('团队名称') + '&type=text&value=' + encodeURIComponent(curName),
      events: {
        inputSaved: async (data: any) => {
          var newName = (data.value || '').trim()
          if (!newName || newName === curName) return
          try {
            const r = await teamApi.updateTeam(this.data.teamId, { name: newName })
            if (r.code === 200) {
              wx.showToast({ title: '已修改', icon: 'none' })
              this.loadData()
            } else {
              wx.showToast({ title: '修改失败', icon: 'none' })
            }
          } catch (e) {
            wx.showToast({ title: '网络错误', icon: 'none' })
          }
        }
      }
    })
  },

  onUploadCover() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFile = res.tempFiles[0]
        if (!tempFile) return
        wx.showLoading({ title: '上传中...' })
        try {
          const r = await teamApi.updateTeam(this.data.teamId, { cover_url: tempFile.tempFilePath })
          if (r.code === 200) {
            wx.showToast({ title: '已更新', icon: 'none' })
            this.loadData()
          } else {
            wx.showToast({ title: '上传失败', icon: 'none' })
          }
        } catch (e) {
          wx.showToast({ title: '上传失败', icon: 'none' })
        }
        wx.hideLoading()
      }
    })
  },

  onMemberTap(e: any) {
    const userId = e.currentTarget.dataset.uid
    if (!userId) return
    wx.navigateTo({ url: '/pages/team/card?userId=' + userId })
  },

  onEditServiceTypes() {
    const curTypes = (this.data.team && this.data.team.service_types) || []
    wx.navigateTo({
      url: '/pages/common/input?title=' + encodeURIComponent('服务类型') + '&type=text&value=' + encodeURIComponent(curTypes.join(',')),
      events: {
        inputSaved: async (data: any) => {
          const input = (data.value || '').trim()
          const types = input ? input.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean) : []
          try {
            const r = await teamApi.updateTeam(this.data.teamId, { service_types: types })
            if (r.code === 200) {
              wx.showToast({ title: '已更新', icon: 'none' })
              this.loadData()
            } else {
              wx.showToast({ title: '修改失败', icon: 'none' })
            }
          } catch (e) {
            wx.showToast({ title: '网络错误', icon: 'none' })
          }
        }
      }
    })
  },

  onLeaveTeam() {
    wx.showModal({
      title: '退出团队',
      content: '确定退出「' + (this.data.team ? this.data.team.name : '') + '」？',
      success: async (res) => {
        if (!res.confirm) return
        try {
          const r = await teamApi.leaveTeam(this.data.teamId)
          if (r.code === 200) {
            wx.showToast({ title: '已退出', icon: 'none' })
            this._syncRemoveFromTeamChat('u-001')
            wx.navigateBack()
          } else {
            wx.showToast({ title: '操作失败', icon: 'none' })
          }
        } catch (e) {
          wx.showToast({ title: '网络错误', icon: 'none' })
        }
      }
    })
  },

  onCreateTeam() {
    wx.showModal({
      title: '创建团队',
      editable: true,
      placeholderText: '请输入团队名称',
      success: async (res) => {
        if (!res.confirm) return
        var name = (res.content || '').trim()
        if (!name) {
          wx.showToast({ title: '请输入名称', icon: 'none' })
          return
        }
        try {
          const result = await teamApi.createTeam({ name })
          if (result.code === 200 && result.data) {
            // 创建团队群
            chatApi.createChat({
              chat_type: 'team',
              chat_name: name,
              team_id: result.data.team_id,
              member_ids: ['u-001']
            })
            wx.showToast({ title: '创建成功', icon: 'none' })
            setTimeout(() => {
              wx.navigateBack({ delta: getCurrentPages().length > 1 ? 1 : 0 })
            }, 800)
          } else {
            wx.showToast({ title: '创建失败', icon: 'none' })
          }
        } catch (e) {
          wx.showToast({ title: '网络错误', icon: 'none' })
        }
      }
    })
  },

  onDissolveTeam() {
    wx.showModal({
      title: '解散团队',
      content: '解散后所有成员将被移出，确定解散「' + (this.data.team ? this.data.team.name : '') + '」？',
      success: async (res) => {
        if (!res.confirm) return
        try {
          const r = await teamApi.dissolveTeam(this.data.teamId)
          if (r.code === 200) {
            wx.showToast({ title: '已解散', icon: 'none' })
            this._syncCloseTeamChat()
            setTimeout(() => wx.navigateBack(), 800)
          } else {
            wx.showToast({ title: '解散失败', icon: 'none' })
          }
        } catch (e) {
          wx.showToast({ title: '网络错误', icon: 'none' })
        }
      }
    })
  },

  // ====== 群聊同步 ======
  async _syncRemoveFromTeamChat(userId: string) {
    try {
      var chatsRes = await chatApi.getChatList()
      if (chatsRes.code !== 200) return
      var teamChat = chatsRes.data.find(function(c) {
        return c.team_id === this.data.teamId && c.chat_type === 'team'
      }.bind(this) as any)
      if (teamChat) {
        chatApi.removeMember(teamChat.chat_id, userId)
      }
    } catch (e) { /* 静默 */ }
  },

  async _syncCloseTeamChat() {
    try {
      var chatsRes = await chatApi.getChatList()
      if (chatsRes.code !== 200) return
      var teamChat = chatsRes.data.find(function(c) {
        return c.team_id === this.data.teamId && c.chat_type === 'team'
      }.bind(this) as any)
      if (teamChat) {
        chatApi.closeChat(teamChat.chat_id)
      }
    } catch (e) { /* 静默 */ }
  }
})
