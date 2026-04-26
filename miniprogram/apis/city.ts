import { api, USE_MOCK, ApiResponse } from '../utils/request'

// ===== 类型 =====
export interface City {
  city_id: string
  name: string
  letter?: string
}

export interface CityGroup {
  letter: string
  cities: City[]
}

// ===== Mock 数据 =====
var HOT_CITIES: City[] = [
  { city_id: '1', name: '北京', letter: 'B' },
  { city_id: '2', name: '上海', letter: 'S' },
  { city_id: '3', name: '广州', letter: 'G' },
  { city_id: '4', name: '深圳', letter: 'S' },
  { city_id: '5', name: '杭州', letter: 'H' },
  { city_id: '6', name: '成都', letter: 'C' },
  { city_id: '7', name: '南京', letter: 'N' },
  { city_id: '8', name: '武汉', letter: 'W' },
  { city_id: '9', name: '西安', letter: 'X' }
]

var ALL_CITIES: CityGroup[] = [
  { letter: 'B', cities: [{ city_id: '1', name: '北京', letter: 'B' }, { city_id: '11', name: '保定', letter: 'B' }] },
  { letter: 'C', cities: [{ city_id: '6', name: '成都', letter: 'C' }, { city_id: '10', name: '重庆', letter: 'C' }, { city_id: '12', name: '长沙', letter: 'C' }] },
  { letter: 'D', cities: [{ city_id: '13', name: '大连', letter: 'D' }, { city_id: '14', name: '东莞', letter: 'D' }] },
  { letter: 'G', cities: [{ city_id: '3', name: '广州', letter: 'G' }] },
  { letter: 'H', cities: [{ city_id: '5', name: '杭州', letter: 'H' }, { city_id: '15', name: '合肥', letter: 'H' }] },
  { letter: 'J', cities: [{ city_id: '16', name: '济南', letter: 'J' }] },
  { letter: 'K', cities: [{ city_id: '17', name: '昆明', letter: 'K' }] },
  { letter: 'N', cities: [{ city_id: '7', name: '南京', letter: 'N' }, { city_id: '18', name: '南宁', letter: 'N' }] },
  { letter: 'S', cities: [{ city_id: '2', name: '上海', letter: 'S' }, { city_id: '4', name: '深圳', letter: 'S' }, { city_id: '19', name: '苏州', letter: 'S' }] },
  { letter: 'T', cities: [{ city_id: '20', name: '天津', letter: 'T' }] },
  { letter: 'W', cities: [{ city_id: '8', name: '武汉', letter: 'W' }] },
  { letter: 'X', cities: [{ city_id: '9', name: '西安', letter: 'X' }] },
  { letter: 'Z', cities: [{ city_id: '21', name: '郑州', letter: 'Z' }] }
]

// ===== API =====

// 获取热门城市
export function getHotCities(): Promise<ApiResponse<City[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: HOT_CITIES })
  }
  return api.get('/api/cities/hot')
}

// 获取全部城市（按字母分组）
export function getAllCities(): Promise<ApiResponse<CityGroup[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: ALL_CITIES })
  }
  return api.get('/api/cities')
}

// 逆地理编码（坐标→城市）
export function reverseGeocode(lat: number, lng: number): Promise<ApiResponse<City>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: { city_id: '2', name: '上海' } })
  }
  return api.get('/api/geo/reverse', { lat, lng })
}
