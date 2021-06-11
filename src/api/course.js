import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/course/list',
    method: 'get',
    params: query
  })
}

export function createCourse(data) {
  return request({
    url: '/vue-element-admin/course/create',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request({
    url: '/vue-element-admin/course/update',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: '/vue-element-admin/course/delete',
    method: 'post',
    data
  })
}
