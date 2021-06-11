<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: flex; justify-content: space-between;">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增音频
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
            @keyup.enter.native="handleFilter"
          />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容" width="300px">
        <template slot-scope="{row}">
          <div style="display: flex;align-items: center;">
            <img :src="row.cover" style="width: 100px;height: 100px;">
            <div style="display: flex; flex-direction: column; justify-content: center;padding: 10px;">
              <span>{{ row.title }}</span>
              <span style="color: red;padding-top: 10px;">{{ row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订阅量" width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.sub_count }}
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status?'success':'danger'">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="!row.status" size="mini" type="success" @click="handleModifyStatus(row,1)">
            上架
          </el-button>
          <el-button v-if="row.status" size="mini" @click="handleModifyStatus(row,0)">
            下架
          </el-button>
          <el-popconfirm title="确定删除该记录吗？" @onConfirm="handleDelete(row,$index)">
            <el-button v-if="row.status!='deleted'" slot="reference" style="margin: 7px 10px;" size="mini" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="封面图" prop="cover">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handlesuccess"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
            <img width="100%" :src="temp.avatar" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="课程状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程介绍" prop="try_content" label-width="80px">
          <tinymce v-model="temp.try_content" :height="300" :width="600" />
        </el-form-item>
        <el-form-item label="音频内容" prop="content" label-width="80px">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-change="hanldeuploadchange"
            :limit="1"
            :on-success="handlecontent"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">格式只支持mp3,m4a为保证播放的流畅性，请勿上传超过500M的文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-input-number v-model="temp.price" :min="1" label="课程价格" @change="handleChange" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelbtn">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const statusOptions = {
  1: '已上架',
  0: '已下架'
}
import Tinymce from '@/components/Tinymce'
import {
  fetchList,
  createAudio,
  updateAudio
} from '@/api/audio'
import waves from '@/directive/waves' // waves directive
import {
  parseTime
} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    Tinymce
  },
  directives: {
    waves
  },
  watch: {
    'temp.content':
    {
      handler(v, old) {
        this.$nextTick(() => {
          if (this.$refs.content) {
            this.$refs.content.setContent(v)
          }
        })
        // this.$refs['content'].setContent(v)
      }
    },
    'temp.try_content':
    {
      handler(v, old) {
        this.$nextTick(() => {
          if (this.$refs.try_content) {
            this.$refs.try_content.setContent(v)
          }
        })
        // this.$refs['try_content'].setContent(v)
      }
    }
  },
  filters: {
    parint(str) {
      return parseInt(str)
    },
    statusFilter(status) {
      return statusOptions[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      dialogVisible: false,
      fileList: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        title: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{
        label: 'ID Ascending',
        key: '+id'
      }, {
        label: 'ID Descending',
        key: '-id'
      }],
      statusOptions,
      // 修改index
      showReviewer: false,
      temp: {
        id: undefined,
        cover: '',
        created_at: new Date(),
        title: '',
        type: '',
        price: 0,
        status: 0,
        try_content: '',
        content: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        title: [{
          required: true,
          message: '标题不能为空',
          trigger: 'blur'
        }],
        try_content: [{
          required: true,
          message: '试看内容不能为空',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '图文内容不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 初始化tinymce值
    inittinymce(v) {
      v.forEach(i => {
        this.$nextTick(() => {
          if (this.$refs[i.key]) {
            this.$refs[i.key].setContent(i.value)
          }
        })
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    hanldeuploadchange(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.fileList = fileList.slice(-3)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleChange(value) {
      console.log(value)
    },
    handlesuccess(response, file, fileList) {
      const { url } = file
      this.temp.cover = url
    },
    handlecontent(response, file, fileList) {
      const { url } = file
      this.temp.content = url
    },
    handlePictureCardPreview(file) {
      this.temp.avatar = file.url
      this.dialogVisible = true
    },
    cancelbtn() {
      this.temp = {
        id: undefined,
        cover: '',
        created_at: new Date(),
        title: '',
        type: '',
        price: 0,
        status: 0,
        try_content: '',
        content: ''
      }
      this.inittinymce([{
        key: 'content',
        value: this.temp.content
      },
      {
        key: 'try_content',
        value: this.temp.try_content
      }
      ])
      this.dialogFormVisible = false
    },
    sortChange(data) {
      const {
        prop,
        order
      } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.temp = {
        id: undefined,
        cover: '',
        created_at: new Date(),
        title: '',
        type: '',
        price: 1,
        status: 0,
        try_content: '',
        content: ''
      }
      this.inittinymce([{
        key: 'content',
        value: this.temp.content
      },
      {
        key: 'try_content',
        value: this.temp.try_content
      }
      ])
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createAudio(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.inittinymce([{
        key: 'content',
        value: this.temp.content
      },
      {
        key: 'try_content',
        value: this.temp.try_content
      }
      ])
      this.temp.created_at = new Date(this.temp.created_at)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.created_at = +new Date(tempData.created_at) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateAudio(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '提示',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'created_at') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
