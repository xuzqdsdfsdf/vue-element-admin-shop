<template>
  <el-form ref="form" label-width="80px" size="normal">
    <!-- 搜索框组件 -->
    <el-form-item label-width="80px" v-if="formType =='search'" label="占位提示">
      <el-input
v-model="search.placeholder"
@input="handleChange('placeholder',$event)"
size="mini"
        style="width: 200px;"></el-input>
    </el-form-item>
    <!-- list列表组件 -->
    <div v-if="formType == 'list'">
      <el-form-item label-width="60px" label="类型">
        <el-radio-group v-model="list.listType" @change="handleChange('listType',$event)">
          <el-radio label="one">单栏</el-radio>
          <el-radio label="two">双栏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="60px" label="标题">
        <el-input v-model="list.title" @input="handleChange('title',$event)"></el-input>
      </el-form-item>
      <el-form-item label-width="60px" label="更多">
        <el-radio-group v-model="list.more" @change="handleChange('showMore',$event)">
          <el-radio :label="true">显示</el-radio>
          <el-radio :label="false">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="更多链接">
        <el-button>选择页面</el-button>
      </el-form-item>
      <div class="d-flex flex-column align-items-center justify-content-center border p-2">
        <el-button icon="el-icon-circle-plus" @click="handlechoose">关联课程</el-button>
        <div class="pt-2">最多关联10门</div>
      </div>
      <drag-list :list="list.data" @deleteitem="deleteitem"></drag-list>
    </div>
    <!-- 限时秒杀 -->
    <div v-if="formType == 'promotion'">
      <el-form-item label-width="60px" label="类型">
        <el-radio-group v-model="promotion.listType" @change="handleChange('listType',$event)">
          <el-radio label="group">团购</el-radio>
          <el-radio label="flash">限时秒杀</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="60px" label="标题">
        <el-input v-model="promotion.title" @input="handleChange('title',$event)"></el-input>
      </el-form-item>
      <el-form-item label="更多链接">
        <el-button>选择页面</el-button>
      </el-form-item>
      <div class="d-flex flex-column align-items-center justify-content-center border p-2">
        <el-button icon="el-icon-circle-plus" @click="handlechoose">关联课程</el-button>
        <div class="pt-2">最多关联10门</div>
      </div>
      <drag-list :list="promotion.data" @deleteitem="deleteitem"></drag-list>
    </div>
    <div v-if="formType=='swiper'">
      <div class="d-flex flex-column align-items-center justify-content-center border p-2">
        <el-button icon="el-icon-circle-plus" @click="handleimg">新增关联图片</el-button>
        <div class="pt-2">最多关联5张图片</div>
      </div>
      <drag-swiper :list="swiper.data" @deleteitem="deleteimg"></drag-swiper>
    </div>
    <div v-if="formType=='imageAd'">
      <div class="d-flex flex-column align-items-center justify-content-center border p-2">
        <el-button icon="el-icon-circle-plus" @click="handleimgad">新增关联广告</el-button>
        <div class="pt-2">最多关联1张图片</div>
      </div>
      <drag-swiper :list="imageAd.data" @deleteitem="deleteimg"></drag-swiper>
    </div>
    <div v-if="formType=='icon'">
      <div class="d-flex flex-column align-items-center justify-content-center border p-2">
        <el-button icon="el-icon-circle-plus" @click="handleicon">新增关联图标</el-button>
        <div class="pt-2">最多关联8个图片地址</div>
      </div>
      <drag-icon :list="icon.data" @deleteitem="deleteicon"></drag-icon>
    </div>
    <choose-course ref="choose"></choose-course>
    <upload-image ref='uploadimg'></upload-image>
  </el-form>
</template>

<script>
import dragIcon from '@/components/FreeComponent/common/Drag-icon.vue'
import dragList from '@/components/FreeComponent/common/Drag-list.vue'
import chooseCourse from '@/components/FreeComponent/ChooseCourse/index.vue'
import dragSwiper from '@/components/FreeComponent/common/Drag-swiper.vue'
import uploadImage from './upload-image.vue'
export default {
  components: {
    dragList,
    chooseCourse,
    dragSwiper,
    uploadImage,
    dragIcon
  },
  provide() {
    return {
      componentform: this
    }
  },
  data() {
    return {
      search: {
        placeholder: ''
      },
      list: {
        data: [],
        listType: '',
        more: false,
        showMore: false,
        title: ''
      },
      promotion: {
        data: [],
        listType: 'group',
        title: ''
      },
      swiper: {
        data: []
      },
      icon: {
        data: []
      },
      coupon: {
        data: []
      },
      imageAd: {
        data: []
      }
    }
  },
  props: {
    formType: {
      type: String,
      default: ''
    }
  },
  methods: {
    initval(data) {
      console.log(data)
      for (const k in data) {
        this[data.type][k] = data[k]
      }
      console.log(this[data.type])
    },
    handleChange(key, value) {
      this[this.formType][key] = value
      this.$emit('handleformChange', {
        key,
        value: this[this.formType][key]
      })
    },
    handlechoose() {
      this.$refs['choose'].open((data) => {
        console.log(data)
        this[this.formType].data = [...this[this.formType].data, ...data]
        this.handleChange('data', this[this.formType].data)
      }, 20)
    },
    handleimgad() {
      if (this[this.formType].data.length === 1) return this.$message({ type: 'error', message: '最多添加一张图片广告' })
      this[this.formType].data.push({
        src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgit.oschina.net%2Fuploads%2Fimages%2F2015%2F0711%2F112237_b6b4f957_417252.png&refer=http%3A%2F%2Fgit.oschina.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625734435&t=e7427fc9f9988f3b5a768ba3ce1cccda',
        type: '', // 图片链接course or webview链接
        course_title: '',
        course_id: 0,
        url: ''
      })
    },
    // 新增关联图片
    handleimg() {
      this[this.formType].data.push({
        src: '',
        type: '', // 图片链接course or webview链接
        course_title: '',
        course_id: 0,
        url: ''
      })
    },
    // 新增图标分类
    handleicon() {
      console.log(this[this.formType].data.length)
      if (this[this.formType].data.length >= 5) {
        return this.$message({
          type: 'error',
          message: '最多添加5个图标'
        })
      }
      this[this.formType].data.push({
        src: 'https://img-bss.csdn.net/1622013908114.png',
        name: '分类',
        type: '',
        url: '',
        page_id: 0,
        course_title: '',
        course_id: 0
      })
    },
    deleteitem({ element, index }) {
      console.log(element, index)
      this.$confirm('确定要取消关联该课程', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this[this.formType].data.findIndex(v => v.id === element.id)
        if (index === -1) return
        this[this.formType].data.splice(index, 1)
        this.handleChange('data', this[this.formType].data)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    deleteimg({ element, index }) {
      console.log(element, index)
      this.$confirm('确定要取消关联该课程', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (element.course_id === 0) return this.$message({ type: 'warning', message: '请在关联课程或链接后删除' })
        const index = this[this.formType].data.findIndex(v => v.course_id === element.course_id)
        if (index === -1) return
        this[this.formType].data.splice(index, 1)
        this.handleChange('data', this[this.formType].data)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    deleteicon({ element, index }) {
      console.log(element, index)
      this.$confirm('确定要取消关联该图标', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this[this.formType].data.splice(index, 1)
        this.handleChange('data', this[this.formType].data)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
</style>
