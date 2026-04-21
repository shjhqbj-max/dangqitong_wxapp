// ============================
// 常用联系人 mock 数据
// ============================

export interface FrequentContact {
  role: string
  name: string
  phone: string
}

export const FREQUENT_CONTACTS: FrequentContact[] = [
  { role: '新人', name: '张三', phone: '13800001111' },
  { role: '新人', name: '李四', phone: '13800002222' },
  { role: '化妆师', name: '小美', phone: '13800004444' },
  { role: '策划师', name: '小陈', phone: '13800007777' },
  { role: '主持人', name: '大伟', phone: '13800010000' },
  { role: '摄影师', name: '李明', phone: '13800018888' },
  { role: '新人', name: '王五', phone: '13800003333' },
  { role: '场地联系人', name: '赵经理', phone: '13800020000' },
]
