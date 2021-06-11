import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/vue-element-admin/renovation/mobile/list',
    method: 'get',
  })
}

export function mobileCreate() {
  return request({
    url: '/vue-element-admin/renovation/mobile/create',
    method: 'get',
  })
}

export function mobileUpdate() {
  return request({
    url: '/vue-element-admin/renovation/mobile/update',
    method: 'post',
  })
}

export function mobileDelete() {
  return request({
    url: '/vue-element-admin/renovation/mobile/delete',
    method: 'get',
  })
}
