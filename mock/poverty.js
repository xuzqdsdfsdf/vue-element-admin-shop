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
    created_at: '@now',
    account: '6222021208017891373',
    no: '@increment(100)', //@increment = Random.increment()  @等价为random
    name: '徐XX',
    'price|1': [1234.00, 234.00, 123.00], //提现金额
    'status|1': [0, 1], //1成功2失败
    //随机数组中的一个可以写为 'price|1':[10,5,10,23,123]
    updated_at: '@now',
  }))
}

module.exports = [{
    url: '/vue-element-admin/pay/poverty_record/list',
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

  // 修改记录接口
  {
    url: '/vue-element-admin/pay/poverty_record/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 删除接口
  {
    url: '/vue-element-admin/pay/poverty_record/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 提现收款设置
  {
    url: '/vue-element-admin/pay/povery_set',
    type: 'get',
    response: config => {
      const {
        page = 1,
          limit = 20
      } = config.query
      let mockList = [];
      mockList.push(Mock.mock({
        id: '@increment',
        name: '王欢',
        province: '广东省',
        city: '广州市',
        area: '白云区',
        bank: '中国银行',
        path: '中国银行',
        'status|1': [0, 1],
        account: '6222021208017891373',
        created_at: '@now'
      }))
      return {
        code: 20000,
        data: {
          data: mockList,
          total: mockList.length
        }
      }
    }
  },
  // 创建提现
  {
    url: '/vue-element-admin/pay/povery_record/create',
    type: 'post',
    response: config => {
      const {
        price,
        account_id
      } = config.query
      return {
        code: 20000,
        data: Mock.mock({
          id: '@increment',
          name: '王欢',
          price,
          status: 0,
          account: '6222021208017891373',
          created_at: '@now'
        })
      }
    }
  },
  // 创建提现账号
  {
    url: '/vue-element-admin/pay/povery_account/create',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data:'success'
      }
    }
  },
  // 删除提现账号
  // 更新提现账号
  {
    url: '/vue-element-admin/pay/povery_account/update',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data:'success'
      }
    }
  },
  {
    url: '/vue-element-admin/pay/povery_account/delete',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data:'success'
      }
    }
  },
]
