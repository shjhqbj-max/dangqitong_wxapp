// 补充微信小程序新 API 的类型声明（基础库 2.20.1+）
// 用于替代已弃用的 wx.getSystemInfoSync

declare namespace WechatMiniprogram {
  interface WindowInfo {
    /** 设备像素比 */
    pixelRatio: number
    /** 屏幕宽度，单位 px */
    screenWidth: number
    /** 屏幕高度，单位 px */
    screenHeight: number
    /** 可使用窗口宽度，单位 px */
    windowWidth: number
    /** 可使用窗口高度，单位 px */
    windowHeight: number
    /** 状态栏的高度，单位 px */
    statusBarHeight: number
    /** 在竖屏正方向下的安全区域 */
    safeArea: SafeArea
    /** 屏幕渲染上下文支持的最大纹理尺寸 */
    screenTop: number
  }

  interface SafeArea {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number
  }

  interface DeviceInfo {
    /** 应用二进制接口类型（仅 Android） */
    abi?: string
    /** 设备品牌 */
    deviceBrand: string
    /** 设备型号 */
    deviceModel: string
    /** 设备方向 */
    deviceOrientation: 'portrait' | 'landscape'
    /** 设备像素比 */
    devicePixelRatio: number
    /** 设备类型 */
    deviceType: string
    /** 运行内存大小，单位 GB */
    memorySize?: number
    /** 操作系统及版本 */
    system: string
    /** 操作系统类型，可选值：android、ios、windows、mac、harmony、devtools */
    platform: 'android' | 'ios' | 'windows' | 'mac' | 'harmony' | 'devtools'
  }

  interface AppBaseInfo {
    /** 客户端基础库版本 */
    SDKVersion: string
    /** 是否已打开调试。可通过右上角菜单或 [wx.setEnableDebug](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.setEnableDebug.html) 打开调试 */
    enableDebug: boolean
    /** 微信宿主的环境 */
    host: AppBaseInfoHost
    /** 微信设置的语言 */
    language: string
    /** 微信版本号 */
    version: string
    /** 系统当前主题，可选值：dark、light，全局配置"darkmode":true时才开启 */
    theme?: 'dark' | 'light'
  }

  interface AppBaseInfoHost {
    /** 宿主 app 对应的 appId */
    appId: string
  }

  interface Wx {
    /** 获取窗口信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/window-info/wx.getWindowInfo.html
     */
    getWindowInfo(): WindowInfo
    /** 获取设备信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/device-info/wx.getDeviceInfo.html
     */
    getDeviceInfo(): DeviceInfo
    /** 获取微信APP基础信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/app-base-info/wx.getAppBaseInfo.html
     */
    getAppBaseInfo(): AppBaseInfo
  }
}
