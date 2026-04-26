// 职业常量 — 全项目统一引用
// 与 helpers.wxs 的 getProClass 映射一致，CSS 类名与 variables.wxss 的 --role-* 变量对应

export interface Profession {
  /** 职业名称（显示文案） */
  label: string
  /** CSS 类名后缀，对应 .pro-{name} 和 --role-{name} */
  css: string
}

export const PROFESSIONS: Profession[] = [
  { label: '主持', css: 'host' },
  { label: '化妆', css: 'makeup' },
  { label: '摄像', css: 'video' },
  { label: '摄影', css: 'photo' },
  { label: '督导', css: 'director' },
  { label: '花艺', css: 'floral' },
  { label: '灯光', css: 'lighting' },
  { label: '场布', css: 'setup' },
  { label: '车队', css: 'car' },
  { label: '演出', css: 'show' }
]

/** 职业名 → CSS 类名（供 TS 层使用，WXML 层用 helpers.wxs 的 getProClass） */
export const PROFESSION_CSS_MAP: Record<string, string> = {
  '主持': 'pro-host', '主持人': 'pro-host',
  '化妆': 'pro-makeup',
  '摄像': 'pro-video',
  '摄影': 'pro-photo',
  '督导': 'pro-director',
  '花艺': 'pro-floral',
  '灯光': 'pro-lighting',
  '场布': 'pro-setup',
  '车队': 'pro-car',
  '演出': 'pro-show'
}

/** 职业名列表（纯字符串，方便 picker 等使用） */
export const PROFESSION_LABELS: string[] = PROFESSIONS.map(p => p.label)
