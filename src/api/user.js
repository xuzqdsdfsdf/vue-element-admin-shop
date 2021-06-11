import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function fetchList(query)
{
  return request({
    url: '/vue-element-admin/user/list',
    method: 'get',
    params: query
  })
}
export function fetchDetail(query)
{
  return request({
    url: '/vue-element-admin/user_detail',
    method: 'get',
    params: query
  })
}
// 用户详情的相关接口如下
// 用户课程订阅
export function fetchUsercourse(query)
{
  let {type} = query
  return request({
    method:'get',
    url:`/vue-element-admin/user_${type}`,
    params:query
  })
}
