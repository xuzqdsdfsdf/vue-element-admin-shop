const Mock = require('mockjs')

const List = []
const count = 100

const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment(100)', //@increment = Random.increment()  @等价为random
    title: '@cparagraph(1)',
    cover: '@image("250x250")',
    try_content: '@cparagraph(20,30)', //试看内容随机生成一段中文
    content: '@cparagraph(20,30)', //内容
    price: '@integer(50,100)', //价格
    total_price: '@integer(50,100)', //价格
    //随机数组中的一个可以写为 'price|1':[10,5,10,23,123]
    'status|1': [0, 1], //0下架，1上架
    created_at: '@now',
    updated_at: '@now',
  }))
}

module.exports = []
