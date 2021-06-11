const Mock = require('mockjs')

const List = []
const count = 100
// 图文
const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    ID: '@increment(100)', //@increment = Random.increment()  @等价为random
    no: '@increment(100)', //@increment = Random.increment()  @等价为random
    goods: [{
      title: '@cparagraph(2)'
    }],
    'type|1': ['default', 'group'],
    'status|1': ['pending', 'success', 'fail'],
    'total_price|1': [10, 20, 30],
    'price|1': [10, 20, 30], //价格
    'pay_method|1': 'wechat',
    pay_at: '@now',
    //随机数组中的一个可以写为 'price|1':[10,5,10,23,123]
    created_at: '@now',
    updated_at: '@now',
  }))
}

module.exports = [{
    url: '/vue-element-admin/pay/order_record/list',
    type: 'get',
    response: config => {
      const {
        page = 1,
        limit = 20,
      } = config.query
      // 拿到的请求参数
      const pageList = List.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: List.length,
          data: pageList
        }
      }
    }
  },
 
  // 修改订单记录接口
  {
    url: '/vue-element-admin/pay/order_record/update',
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
    url: '/vue-element-admin/pay/order_record/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
