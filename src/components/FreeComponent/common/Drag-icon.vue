<template>
  <div class="dndList">
    <div class="dndList-list">
      <draggable :set-data="setData" :list="list" group="article" class="dragArea">
        <div
v-for="(element,index) in list"
:key="index"
class="list-complete-item "
          style="background-color: #F7F6F9;width: 100%;">
          <div class="d-flex align-items-center">
            <img
@click="handlechangeimg(element)"
src="../../../views/renovation/asset/default.jpg"
              style="width: 40px;height: 40px;flex-shrink: 1;" />
            <div class="d-flex  flex-column  p-2">
              <el-input v-model="element.name" size="mini" class="mb-2" placeholder="图标名称"></el-input>
              <el-select v-model="element.type" size="mini" placeholder="分类名称">
                <el-option v-for="(i,iindex) in options" :key="iindex" :value="i.value" :label="i.label"></el-option>
              </el-select>
              <el-input
                v-if="element.type == 'webview'"
                class="my-1"
                size="medium"
                placeholder="请输入跳转网页地址"
                style="width: 160px;"></el-input>
              <el-button @click="relateCourse(element)" v-else-if="element.type=='course'" type="primary" class="my-2">
                {{element.course_title?'标题:'+ element.course_title: '关联课程'}}</el-button>
                <el-button v-if="element.type=='page'" class="mt-2" size="mini" @click="relatepage(element)">关联页面</el-button>
            </div>
          </div>
          <div>
            <span style="float: right ;margin-top: -20px;margin-right:5px;">
              <i
@click="$emit('deleteitem',{element,index})"
                style="color:#ff4949;position: absolute;top: 0px;right: 0px;font-size: 20px;"
class="el-icon-delete" />
            </span>
          </div>

        </div>
      </draggable>
      <choose-page ref="choosepage"></choose-page>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import choosePage from '../ChoosePage/index.vue'
export default {
  name: 'DndList',
  components: {
    draggable,
    choosePage
  },
  inject: ['componentform'],
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      options: [{
        label: '网页',
        value: 'webview'
      },
      {
        label: '课程',
        value: 'course'
      },
      {
        label: '页面',
        value: 'page'
      }
      ]
    }
  },
  methods: {
    isNotInList1(v) {
      return this.list1.every(k => v.id !== k.id)
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    relateCourse(item) {
      this.componentform.$refs['choose'].open((data) => {
        var selecteddata = data[0]
        item.course_title = selecteddata.title
        item.course_id = selecteddata.id
      }, 1)
    },
    relatepage(item) {
      this.$refs['choosepage'].open(data => {
        console.log(data)
      }, 1)
    },
    handlechangeimg(element) {
      this.componentform.$refs['uploadimg'].open((url) => {
        element.src = url
      }, element.src || '../../../views/renovation/asset/default.jpg')
    }
  }
}
</script>

<style lang="scss" scoped>
  .dndList {
    background: #fff;
    padding-bottom: 40px;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .dndList-list {
      padding-bottom: 30px;

      &:first-of-type {
        margin-right: 2%;
      }

      .dragArea {
        margin-top: 15px;
        min-height: 50px;
        padding-bottom: 30px;
      }
    }
  }

  .list-complete-item {
    cursor: pointer;
    position: relative;
    font-size: 14px;
    padding: 5px 12px;
    margin-top: 4px;
    border: 1px solid #bfcbd9;
    transition: all 1s;
  }

  .list-complete-item-handle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-complete-item-handle2 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 20px;
  }

  .list-complete-item.sortable-chosen {
    background: #4AB7BD;
  }

  .list-complete-item.sortable-ghost {
    background: #30B08F;
  }

  .list-complete-enter,
  .list-complete-leave-active {
    opacity: 0;
  }
</style>
