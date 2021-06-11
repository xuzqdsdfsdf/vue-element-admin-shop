import request from '@/utils/request'
// 音频接口

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/column/list',
    method: 'get',
    params: query
  })
}

export function createColumn(data) {
  return request({
    url: '/vue-element-admin/column/create',
    method: 'post',
    data
  })
}

export function updateColumn(data) {
  return request({
    url: '/vue-element-admin/column/update',
    method: 'post',
    data
  })
}

export function fetchColumnDetail(data) {
  return request({
    url: '/vue-element-admin/column/detail',
    method: 'get',
    params: data
  })
}

export function fetchColumnDetailCourse(data) {
  return request({
    url: '/vue-element-admin/column/detail/course',
    method: 'get',
    params: data
  })
}

export function deleteColumn(data) {
  return request({
    url: '/vue-element-admin/column/delete',
    method: 'post',
    data
  })
}
