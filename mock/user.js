const Mock = require('mockjs')
let List = []
const count = 100
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment(100)', //@increment = Random.increment()  @等价为random
    user_id: '@increment(100)', //@increment = Random.increment()  @等价为random
    user: {
      username: '@word(15)',
      id: '@increment(100)', //@increment = Random.increment()  @等价为random
      avatar: '@image("100x100")',
      nickname: '',
      phone: 15911324565,
      'status|1': [0, 1], //状态 0禁用 1启用
      user_level: '年度会员',
      user_level_expire: '@now', //过期时间
      created_at: '@now', //创建时间
    },
    'total_price|1': [101, 204, 350, 460, 1000], //价格
    // 禁止评论
    'no_comment|1': [0, 1], //1禁止，0正常
    'no_access|1': [0, 1], //同上
    //随机数组中的一个可以写为 'price|1':[10,5,10,23,123]
    created_at: '@now',
    updated_at: '@now',
  }))
}
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [{
    url: '/vue-element-admin/user/list',
    type: 'get',
    response: config => {
      const {
        title,
        page = 1,
        limit = 20,
      } = config.query
      // 拿到的请求参数
      let mockList = List.filter(item => {
        // if (type && item.type !== type) return false
        if (title && item.user.username.indexOf(title) < 0) return false
        return true
      })
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: title ? mockList.length : List.length,
          items: pageList
        }
      }
    }
  },
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const {
        username
      } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const {
        token
      } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/user_detail',
    type: 'get',
    response: config => {
      let {
        id
      } = config.query
      let data = List.find(v => v.user.id == id)
      console.log(data);
      return {
        code: 20000,
        data
      }
    }
  },
  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/user_detail',
    type: 'get',
    response: config => {
      let {
        id
      } = config.query
      let data = List.find(v => v.user.id == id)
      console.log(data);
      return {
        code: 20000,
        data
      }
    }
  },
  // 用户课程列表
  {
    url: '/vue-element-admin/user_course',
    type: 'get',
    response: config => {
      const {
        page = 1,
          limit = 20,
      } = config.query
      let mockList = []
      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment(100)', //@increment = Random.increment()  @等价为random
          title:'@cparagraph(2)',
          'price|1':[234,123,4645],
          created_at:'@now',
          updated_at: '@now',
        }))
      }
      // 拿到的请求参数
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          data: pageList
        }
      }
    }
  },
  // 用户专栏列表
  {
    url: '/vue-element-admin/user_column',
    type: 'get',
    response: config => {
      const {
        page = 1,
          limit = 20,
      } = config.query
      let mockList = []
      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment(100)', //@increment = Random.increment()  @等价为random
           title:'@cparagraph(2)',
          'price|1':[234,123,4645],
          created_at:'@now',
          updated_at: '@now',
        }))
      }
      // 拿到的请求参数
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          data: pageList
        }
      }
    }
  },
  // 用户订单列表
  {
    url: '/vue-element-admin/user_order',
    type: 'get',
    response: config => {
      const {
        page = 1,
          limit = 20,
      } = config.query
      let mockList = []
      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment(100)', //@increment = Random.increment()  @等价为random
          no: '@increment(100)',
          'price|1':[234,123,4645],
          'status|1':['peding','complete','fail'],
           title:'@cparagraph(2)',
          created_at:'@now',
          updated_at: '@now',
        }))
      }
      // 拿到的请求参数
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          data: pageList
        }
      }
    }
  },
  // 用户历史列表
  {
    url: '/vue-element-admin/user_history',
    type: 'get',
    response: config => {
      const {
        page = 1,
          limit = 20,
      } = config.query
      let mockList = []
      for (let i = 0; i < count; i++) {
        id: '@increment(100)', //@increment = Random.increment()  @等价为random
        mockList.push(Mock.mock({
           title:'@cparagraph(2)',
          'type|1':['media','audio','video','column'],
          'total_time|1': ['12m','12m'],
          created_at:'@now',
          updated_at: '@now',
        }))
      }
      // 拿到的请求参数
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          data: pageList
        }
      }
    }
  },
  // 用户订单列表
  {
    url: '/vue-element-admin/user_comment',
    type: 'get',
    response: config => {
      const {
        page = 1,
          limit = 20,
      } = config.query
      let mockList = []
      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment(100)', //@increment = Random.increment()  @等价为random
          content:'@cparagraph(5,10)',
           title:'@cparagraph(2)',
          'type|1':['media','audio','video','column'],
          created_at:'@now',
          updated_at: '@now',
        }))
      }
      // 拿到的请求参数
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          data: pageList
        }
      }
    }
  },
]
