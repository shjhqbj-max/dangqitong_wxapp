// 自定义导航栏组件
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    leftText: {
      type: String,
      value: ''
    },
    showBack: {
      type: Boolean,
      value: false
    },
    bgColor: {
      type: String,
      value: ''
    },
    titleColor: {
      type: String,
      value: ''
    },
    rightText: {
      type: String,
      value: ''
    }
  },
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    capsuleWidth: 0,
    capsuleLeft: 0,
    extraHeight: 0
  },
  lifetimes: {
    attached() {
      const windowInfo = wx.getWindowInfo()
      const capsule = wx.getMenuButtonBoundingClientRect()

      this.setData({
        statusBarHeight: windowInfo.statusBarHeight,
        navBarHeight: windowInfo.statusBarHeight + 44,
        capsuleWidth: capsule.width,
        capsuleLeft: windowInfo.screenWidth - capsule.right
      })
      this.triggerEvent('height', { height: windowInfo.statusBarHeight + 44 })
    },
    ready() {
      this.calcExtraHeight()
    }
  },
  methods: {
    onBack() {
      wx.navigateBack()
    },
    onLeftTap() {
      this.triggerEvent('lefttap')
    },
    onRightTap() {
      this.triggerEvent('right')
    },
    calcExtraHeight() {
      const query = this.createSelectorQuery()
      query.select('.nav-bar-extra').boundingClientRect((rect) => {
        if (rect && rect.height > 0) {
          this.setData({ extraHeight: rect.height })
        }
      }).exec()
    }
  }
})
