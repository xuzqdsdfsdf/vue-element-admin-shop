const Mock = require('mockjs')
const List = [
  {
    id: 1,
    title: '首页',
    created_time: '2021-05-22 21:14',
    updated_time: '2021-05-22 21:14',
    isdefault: 1,
    type: 'index'
  },
  {
    id: 2,
    title: '列表数据',
    created_time: '2021-05-22 21:14',
    updated_time: '2021-05-22 21:14',
    isdefault: 0,
    type: 'common'
  }
]
const count = 100
// 图文
const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
module.exports = [{
  url: '/vue-element-admin/renovation/mobile/list',
  type: 'get',
  response: config => {
    return {
      code: 20000,
      data: {
        total: List.length,
        data: List
      }
    }
  }
},
// 新增
{
  url: '/vue-element-admin/renovation/mobile/create',
  type: 'post',
  response: config => {
    return {
      code: 20000,
      data: 'success'
    }
  }
},
// 修改
{
  url: '/vue-element-admin/renovation/mobile/update',
  type: 'post',
  response: config => {
    return {
      code: 20000,
      data: 'success'
    }
  }
},
// 删除
{
  url: '/vue-element-admin/renovation/mobile/delete',
  type: 'post',
  response: config => {
    return {
      code: 20000,
      data: 'success'
    }
  }
},
]
