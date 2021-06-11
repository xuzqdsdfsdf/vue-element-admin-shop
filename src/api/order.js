import request from '@/utils/request'
// 图文接口
export function fetchList(query) {
  return request({
    url: '/vue-element-admin/pay/order_record/list',
    method: 'get',
    params: query
  })
}

export function deleteOrder(data) {
  return request({
    url: '/vue-element-admin/pay/order_record/delete',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/vue-element-admin/pay/order_record/update',
    method: 'post',
    data
  })
}