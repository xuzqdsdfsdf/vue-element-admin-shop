const Mock = require('mockjs')

const List = []
const count = 100
// 图文
const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment(100)', //@increment = Random.increment()  @等价为random
    title: '@cparagraph(1)',
    cover: '@image("150X80")',
    try_content: '@cparagraph(20,30)', //试看内容随机生成一段中文
    content: '@cparagraph(20,30)', //内容
    price: '@integer(50,100)', //价格
    'sub_count|1':[100,200,300,400,150], //订阅量
    //随机数组中的一个可以写为 'price|1':[10,5,10,23,123]
    'status|1': [0, 1], //0下架，1上架
    created_at: '@now',
    updated_at: '@now',
  }))
}

module.exports = [{
    url: '/vue-element-admin/media/list',
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
          total:  filterList.length,
          items: pageList
        }
      }
    }
  },
// 创建课程接口
  {
    url: '/vue-element-admin/media/create',
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
    url: '/vue-element-admin/media/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 删除课程接口
  {
    url: '/vue-element-admin/media/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
