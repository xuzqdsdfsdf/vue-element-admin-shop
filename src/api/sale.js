import request from '@/utils/request'
// 音频接口

export function fetchGroup(query) {
  return request({
    url: '/vue-element-admin/sale/group/list',
    method: 'get',
    params: query
  })
}

export function createGroup(data) {
  return request({
    url: '/vue-element-admin/sale/group/create',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/vue-element-admin/sale/group/update',
    method: 'post',
    data
  })
}


