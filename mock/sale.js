const Mock = require('mockjs')
// 拼团
const List = []
const count = 50
// 图文
// const baseContent =
//   '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment(100)', // @increment = Random.increment()  @等价为random
    'type|1': ['course','column'],
    value:
    {
        id: '@increment(100)',
        title: '@csentence(25)',
        cover: '@image("200X100")',
        price:10
    },
    price: 10.00,
    p_num: 2,
    "status|1":[1,0],
    "auto|1": [1,0],
    expire_time: 24,  //过期时间
    start_time: '@now',
    end_time: '@now',
    created_at: '@now',
    updated_at: '@now'
  }))
}

module.exports = [{
  url: '/vue-element-admin/column/list',
  type: 'get',
  response: config => {
    const {
      status,
      title,
      page = 1,
      limit = 20,
      sort
    } = config.query
    // 拿到的请求参数
    let mockList = List.filter(item => {
      // if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    let filterList = status !== undefined ? mockList.filter((item, index) => item.status == status) : mockList
    const pageList = filterList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 20000,
      data: {
        total: status === undefined ? List.length : filterList.length,
        items: pageList
      }
    }
  }
  },
  // 详情列表
  {
    url: '/vue-element-admin/sale/group/list',
    type: 'get',
    response: config => {
      let {
        status,
        title,
      } = config.query
      // 拿到的请求参数
      return {
        code : 20000,
        data : {
          data:List,
          total:count
        }
      }

    }
  },
  // 课程详情接口
  {
    url: '/vue-element-admin/column/detail',
    type: 'get',
    response: config => {
      const {
        id
      } = config.query
      for (let column of List) {
        if (column.id === +id) {
          return {
            code: 20000,
            data: column
          }
        }
      }
      return {
        code: 404,
        data: false
      }
    }
  },
  // 创建课程接口
  {
    url: '/vue-element-admin/sale/group/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 修改课程接口
  {
    url: '/vue-element-admin/sale/group/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 删除课程接口
]
