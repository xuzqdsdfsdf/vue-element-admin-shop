<template>
  <div class="app-container">
    <el-card shadow="never" >
      <div style="display:flex;align-items:flex-start;padding:5px">
        <img :src="detail.cover" style="width:250px;height:150px" alt="">
        <div style="flex:1;margin:0px 10px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="">{{detail.title}}</h3>
            <span :style="detail.isend?'color:#CCCBCC':'color:red'">{{detail.isend?'已完结':'连载中'}}</span>
          </div>
          <h4 style="color:#CCCBCC;margin-bottom:10px;font-size: .9em;">{{detail.try_content}}</h4>
          <h4 style="color:red">{{detail.price}}</h4>
         <div style="display:flex">
            <el-button  size="mini" type="primary" @click="changestatus" plain>{{detail.status?'下架':'上架'}}</el-button>
            <el-button  size="mini" :type="detail.isend?'warning':'danger'" @click="changisend" plain>{{detail.isend?'设为更新中':'设为已完结'}}</el-button>
         </div>
        </div>
      </div>
    </el-card>
    <!-- 搜索栏 -->
    <div style="display: flex; justify-content: space-between;margin:20px 0">
        <el-button @click="openadd" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" >
          新增目录
        </el-button>
        <div>
          <el-select
            v-model="listQuery.status"
            placeholder="状态"
            clearable
            style="width: 90px;margin-right: 15px;"
            class="filter-item"
          >
            <el-option v-for="(item,k) in statusOptions" :key="k" :label="item" :value="k| parint" />
          </el-select>
          <el-input
            v-model="listQuery.title"
            placeholder="Title"
            style="width: 200px;margin-right: 15px;"
            class="filter-item"
          />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
    </div>
    <!-- 可拖拽表格内容 -->
    <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="徐浩" width="65">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单品内容" width="300px" >
        <template slot-scope="{row}">
          <div style="display: flex;align-items:flex-start">
            <img :src="row.cover" style="width: 100px;height: 100px;">
            <div style="display: flex; flex-direction: column; justify-content: center;padding:0 10px;">
              <span>{{ row.title }}</span>
              <span style="color: red;padding-top: 10px;">{{ row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="Date">
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="订阅量">
        <template slot-scope="{row}">
          <span>{{ row.sub_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status?'success':'danger'">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除该记录吗？" @onConfirm="handleDelete(row,$index)">
            <el-button v-if="row.status!='deleted'" slot="reference" style="margin: 7px 10px;" size="mini" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Drag" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="width:100%;height:1000px"></div> -->
    <!-- 添加详情 -->
    <choose-course ref="columndialog"></choose-course>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
var id = 0
import chooseCourse from '@/components/FreeComponent/ChooseCourse/index.vue'
import { fetchColumnDetailCourse } from '@/api/column.js'
import Sortable from 'sortablejs'
import waves from '@/directive/waves' // waves directive
import { fetchColumnDetail } from '@/api/column'
const statusOptions = {
  1: '已上架',
  0: '已下架'
}
export default {
  directives: {
    waves
  },
  components: {
    chooseCourse
  },
  filters: {
    statusFilter(status) {
      return statusOptions[status]
    },
    parint(str) {
      return parseInt(str)
    }
  },
  beforeRouteEnter(to, from, next) {
    id = to.query.id
    next()
  },
  mounted() {
    this.getData()
    this.getList()
  },
  data() {
    return {
      list: [],
      listLoading: false,
      detail: {
        id: undefined,
        cover: '',
        created_at: new Date(),
        title: '',
        type: '',
        price: 0,
        status: 0,
        isend: 0,
        try_content: '',
        content: ''
      },
      sortable: null,
      statusOptions,
      listQuery: {
        isend: 0, // 连载状态
        status: undefined,
        title: undefined
      }
    }
  },
  methods: {
    // 打开添加弹窗
    openadd() {
      this.$refs['columndialog'].open((res) => {
        console.log(res)
        this.list = [...this.list, ...res]
        this.$message.success('添加目录成功')
      })
    },
    async getList() {
      this.listLoading = true
      const { data } = await fetchColumnDetailCourse({ id })
      this.list = data
      this.listLoading = false
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    getData() {
      fetchColumnDetail({ id }).then(res => {
        // eslint-disable-next-line no-unused-vars
        var data = res.data
        for (const key in data) {
          this.detail[key] = data[key]
        }
      })
    },
    handleUpdate(row) {

    },
    handleDelete(row) {

    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    changestatus() {
      this.detail.status = !this.detail.status
    },
    changisend() {
      this.detail.isend = !this.detail.isend
    },
    // 搜索
    handleFilter() {

    }
  }
}
</script>

<style>
h3{
  margin-top: 3px;
  margin-bottom: 12px;
}
h4{
  margin-top: 8px;
  margin-bottom: 12px;
}
</style>
