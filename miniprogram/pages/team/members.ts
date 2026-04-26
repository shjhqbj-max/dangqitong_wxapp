// 成员管理页
import authGuard from '../../behaviors/auth-guard'
import * as teamApi from '../../apis/team'
import { Team, TeamMember } from '../../mock/types'

Page({
  behaviors: [authGuard],
  data: {
    teamId: '',
    team: null as Team | null,
    members: [] as TeamMember[],
    isAdmin: false,
    inviteCode: 'DQTHGZ01',
    actionIdx: -1
  },

  onLoad(options: any) {
    const teamId = options.teamId || ''
    this.setData({ teamId })
    this.loadData()
  },

  async loadData() {
    const res = await teamApi.getMyTeams()
    if (res.code !== 200) return
    const team = res.data.find((t: Team) => t.team_id === this.data.teamId) || null
    if (!team) return
    const mRes = await teamApi.getTeamMembers(this.data.teamId)
    const members = mRes.code === 200 ? mRes.data : []
    this.setData({
      team,
      members,
      isAdmin: team.my_role === 'admin'
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
          await teamApi.updateMemberRole(this.data.teamId, member.user_id, newRole)
          wx.showToast({ title: '已更新', icon: 'none' })
          this.loadData()
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '确认移除',
            content: '确定将「' + member.nickname + '」移出团队？',
            success: async (modal) => {
              if (!modal.confirm) return
              await teamApi.removeMember(this.data.teamId, member.user_id)
              wx.showToast({ title: '已移除', icon: 'none' })
              this.loadData()
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
    wx.showModal({
      title: '修改团队昵称',
      editable: true,
      placeholderText: '请输入团队昵称',
      content: curName,
      success: async (res) => {
        if (!res.confirm) return
        var newName = (res.content || '').trim()
        if (!newName || newName === curName) return
        await teamApi.updateTeam(this.data.teamId, { name: newName })
        wx.showToast({ title: '已修改', icon: 'none' })
        this.loadData()
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
          // TODO: 替换为真实的上传接口
          await teamApi.updateTeam(this.data.teamId, { cover_url: tempFile.tempFilePath })
          wx.showToast({ title: '已更新', icon: 'none' })
          this.loadData()
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
    const curTypes = this.data.team?.service_types || []
    wx.showModal({
      title: '服务类型',
      editable: true,
      placeholderText: '用逗号分隔，如：婚礼摄影,婚礼摄像,航拍',
      content: curTypes.join(','),
      success: async (res) => {
        if (!res.confirm) return
        const input = (res.content || '').trim()
        const types = input ? input.split(/[,，]/).map(s => s.trim()).filter(Boolean) : []
        await teamApi.updateTeam(this.data.teamId, { service_types: types })
        wx.showToast({ title: '已更新', icon: 'none' })
        this.loadData()
      }
    })
  },

  onLeaveTeam() {
    wx.showModal({
      title: '退出团队',
      content: '确定退出「' + (this.data.team ? this.data.team.name : '') + '」？',
      success: async (res) => {
        if (!res.confirm) return
        await teamApi.leaveTeam(this.data.teamId)
        wx.showToast({ title: '已退出', icon: 'none' })
        wx.navigateBack()
      }
    })
  }
})
