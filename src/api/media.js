import request from '@/utils/request'
// 图文接口
export function fetchList(query) {
  return request({
    url: '/vue-element-admin/media/list',
    method: 'get',
    params: query
  })
}

export function createMedia(data) {
  return request({
    url: '/vue-element-admin/media/create',
    method: 'post',
    data
  })
}

export function updateMedia(data) {
  return request({
    url: '/vue-element-admin/media/update',
    method: 'post',
    data
  })
}

