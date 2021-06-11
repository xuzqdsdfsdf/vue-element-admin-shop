import request from '@/utils/request'
// 图文接口
export function fetchList(query) {
  return request({
    url: '/vue-element-admin/pay/poverty_record/list',
    method: 'get',
    params: query
  })
}

export function deletePoverty(data) {
  return request({
    url: '/vue-element-admin/pay/poverty_record/delete',
    method: 'post',
    data
  })
}

export function updatePoverty(data) {
  return request({
    url: '/vue-element-admin/pay/poverty_record/update',
    method: 'post',
    data
  })
}
export function FetchPovertyset(data) {
  return request({
    url: '/vue-element-admin/pay/povery_set',
    method: 'get',
    params:data
  })
}

export function Cashount(data)
{
  return request({
    url:'/vue-element-admin/pay/povery_record/create',
    method:'post',
    params:data
  })
}

export function CreateAccount(data)
{
  return request({
    url:'/vue-element-admin/pay/povery_account/create',
    method:'post',
    params:data
  })
}
export function UpdateAccount(data)
{
  return request({
    url:'/vue-element-admin/pay/povery_account/update',
    method:'post',
    params:data
  })
}
export function DeleteAccount(data)
{
  return request({
    url:'/vue-element-admin/pay/povery_account/delete',
    method:'post',
    params:data
  })
}