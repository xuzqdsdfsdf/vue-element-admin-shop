<template>
  <div class="" style="background-color: #eee;">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card class="box-card" style="height: 85vh;overflow-y: auto;">
          <el-row :gutter="20">
            <el-col :span="24" style="margin-bottom: 10px;" v-for="(item, index) in components" :key="index">
              <el-card
:body-style="{ padding: '15px 5px', cursor: 'pointer' }"
style="overflow: inherit;"
                @click.native="handleComponent(item)">
                <!-- 添加组件 -->
                <div class="d-flex align-items-center">
                  <i class=" text-success" :class="item.icon" style="font-size:25px"></i>
                  <span style="font-size: 13px;margin-left:5px">{{
                    item.title
                  }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="14" :offset="0" style="height: 85vh;overflow-y: auto;">
        <el-row >
          <el-col :span="23" :offset="0" style="margin-top: 10px;">
            <el-card style="min-height: 85vh;overflow: inherit;" :body-style="{ padding: '0px 8px',overflow:'inherit' }">
              <div style="margin: 0 -10px;">
				  <!-- 状态栏 -->
                <navbar></navbar>
                <div
					class="checked-box "
					@click="handlechoose(item)"
					:class="item.checked ? 'checked-box-active' : ''"
                  v-for="(item, index) in templates"
:key="index">
                  <div v-if="item.checked" class="check-box-btn">
                    <!-- 这里为什么要用stop修饰符，因为在父容器中定义了一个选择的方法，
                            在触发排序函数的同时也会去触发handlechoose(),对选中的对象中isselected属性进行重置为当前点击的对象，
                            不是排序后的对象，所以会导致重新渲染失效，因此要对事件进行限制 -->
                    <i class="el-icon-top" @click.stop="moveUp(index)" :class="index == 0 ? 'i-diable' : ''"></i>
                    <i
class="el-icon-bottom"
@click.stop="moveDown(index)"
                      :class="index + 1 == templates.length ? 'i-diable' : ''"></i>
                    <i class="el-icon-delete" @click.stop="deletecom(item, index)"></i>
                  </div>
                  <!-- 组件位置 -->
                  <template v-if="item.type == 'list'">
                    <list :showMore="item.showMore" :title="item.title" :list="item.data" :listType="item.listType">
                    </list>
                    <!-- 列表组件位置 -->
                  </template>
                  <template v-if="item.type == 'swiper'">
                    <swiper :list="item.data"></swiper>
                  </template>
                  <template v-if="item.type == 'icon'">
                    <icon :list="item.data"></icon>
                  </template>
                  <template v-if="item.type == 'promotion'">
                    <promotion :title="item.title" :list="item.data" :listType="item.listType"></promotion>
                    <!-- 列表组件位置 -->
                  </template>
                  <template v-if="item.type=='imageAd'">
                    <image-ad :list="item.data"></image-ad>
                  </template>
                  <!-- <div class="d-flex align-items-center justify-content-center" style="height: 100px;">
                            {{ item.type }}
                          </div> -->
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <div
v-if="CurrentItem.type "
style=" position: fixed;top: 130px;right: 0px"
        class="bg-white">
        <el-card style="width: 270px;min-height: 85vh;position: relative;">
          <div slot="header"><span>组件编辑</span></div>
          <div style="overflow-y: auto;position: absolute;right: 0;left: 0;bottom: 0;left: 0;top: 60px;">
            <component-form @handleformChange="handleformChange" :formType="CurrentItem.type" ref="componentForm">
            </component-form>
          </div>
        </el-card>
      </div>
    </el-row>
  </div>
</template>

<script>
import navbar from './component/navbar.vue'
import swiper from './component/swiper.vue'
import utils from '@/utils/utils.js'
import componentForm from './component/component-form.vue'
import list from './component/list.vue'
import dragList from '@/components/FreeComponent/common/Drag-list.vue'
import icon from './component/icon.vue'
import promotion from './component/promotion.vue'
import imageAd from './component/imageAd.vue'
export default {
  components: {
    componentForm,
    list,
    dragList,
    swiper,
    icon,
    promotion,
    imageAd,
    navbar
  },
  computed: {
    CurrentItem() {
      const index = this.templates.findIndex(v => v.checked)
      return index === -1 ? {} : this.templates[index]
    }
  },
  data() {
    return {
      components: [
        // 课程列表
        {
          icon: 'el-icon-s-order',
          title: '课程列表',
          type: 'list',
          default: {
            listType: 'one', // 列表类型
            title: '标题',
            showMore: false,
            more: false,
            data: [

            ]
          }
        },
        {
          icon: 'el-icon-search',
          title: '轮播图',
          type: 'swiper',
          default: {
            data: [

            ]
          }
        },
        {
          icon: 'el-icon-search',
          title: '图标分类',
          type: 'icon',
          default: {
            data: [{
              src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgit.oschina.net%2Fuploads%2Fimages%2F2015%2F0711%2F112237_b6b4f957_417252.png&refer=http%3A%2F%2Fgit.oschina.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625734435&t=e7427fc9f9988f3b5a768ba3ce1cccda',
              name: '分类'
            }]
          }
        },
        // 限时拼团
        {
          icon: 'el-icon-s-order',
          title: '课程拼团',
          type: 'promotion',
          default: {
            listType: 'group', // 列表类型
            title: '拼团',
            data: []
          }
        },
        {
          icon: 'el-icon-search',
          title: '图片广告',
          type: 'imageAd',
          default: {
            data: [

            ]
          }
        }
      ],
      templates: [
        // template数组对象格式
        // 列表组件数据
        // {
        // checked: true
        // data: Array(0)
        // listType: "two"
        // more: false
        // showMore: false
        // title: "标题"
        // type: "list"
        // }
        // 搜索框组件数据
        // {
        // checked: true
        // placeholder: '请输入关键字'
        // type:'search'
        // }
      ]
    }
  },
  methods: {
    // 添加组件
    handleComponent(item) {
      const data = JSON.parse(JSON.stringify(item.default))
      data.checked = false
      data.type = item.type
      this.templates.push(data)
    },
    handlechoose(item) {
      console.log(item)
      this.templates.map(v => {
        v.checked = false
        return v
      })
      item.checked = true
      this.$nextTick(() => {
        this.$refs['componentForm'].initval(item)
      })
      // this.$set(item, 'checked', true)
    },
    // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    moveUp(index) {
      if (index === 0) return
      utils.moveUp(this.templates, index)
    },
    // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    moveDown(index) {
      if (index + 1 === this.templates.length) return
      utils.moveDown(this.templates, index)
    },
    deletecom(item, index) {
      this.$confirm('是否删除该组件', '提示', {
        confirmButtonText: '删除',
        concelButtonText: '取消',
        type: 'warn'
      }).then(res => {
        this.templates.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    },
    handleformChange(e) {
      const i = this.templates.findIndex(v => v.checked) // 拿到选中的索引
      if (i !== -1) {
        this.templates[i][e.key] = e.value
      }
    }
  }
}
</script>

<style>
  .checked-box {
    position: relative;
  }

  .checked-box-active {
    border: 2px dotted #2196f3;
    padding: 5px 0;
    margin-bottom: 10px;
  }

  /* 工具栏样式 */
  .check-box-btn {
    position: absolute;
    top: -2px;
    right: -29px;
    background-color: #fff;
    border: 2px dotted #2196f3;
    border-left-width: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
  }

  .check-box-btn i {
    padding: 4px 6px;
    color: #2196f3;
    font-weight: bold;
  }

  .check-box-btn i:hover {
    background-color: #ccc;
  }

  .check-box-btn .i-diable {
    background-color: #fff;
    color: #bbb;
    cursor: no-drop;
  }
</style>
