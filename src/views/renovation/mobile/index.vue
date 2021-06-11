<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: flex; justify-content: space-between;">
        <el-button
class="filter-item"
style="margin-left: 10px;"
type="primary"
icon="el-icon-edit"
          @click="handleCreate">
          新增子页面
        </el-button>
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
      >
      <el-table-column label="页面名称" prop="title"  >
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
          <span v-if="row.type=='index'" class="el-icon-s-home text-primary"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          {{ row.created_time }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="{row}">
          {{ row.updated_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="todetail(row,$index)">
            修饰
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row,$index)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除该记录吗？" @onConfirm="handleDelete(row,$index)">
            <el-button
              :disabled="!!row.isdefault"
              slot="reference"
              style="margin: 7px 10px;"
              size="mini"
              type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
v-show="total>0"
:total="total"
:page.sync="listQuery.page"
:limit.sync="listQuery.limit"
      @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" top="5vh" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label-width="90px" label="页面标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelbtn">
          取消
        </el-button>
        <el-button type="primary" @click="confirm">
          确定
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
import {
  fetchList,
  mobileCreate,
  mobileUpdate,
  mobileDelete,
  deleteMedia
} from '@/api/renovation.js'
import banks from '@/utils/bank.js'
import waves from '@/directive/waves' // waves directive
import {
  parseTime
} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: {
    waves
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
      // 所有银行
      banks: [],
      tableKey: 0,
      list: null,
      total: 0,
      dialogVisible: false,
      editIndex: -1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        title: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      statusOptions,
      showReviewer: false,
      temp: {
        id: 0,
        title: ''
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
          message: '页面标题不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getList()
    this.banks = banks.getBank()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        // Just to simulate the time of the request
        setTimeout(() => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    cancelbtn() {
      this.temp = {
        title: ''
      }
      this.dialogFormVisible = false
    },
    handlechoose(e, k) {
      this.temp[k] = e.value
    },
    resetTemp() {
      this.temp = {
        title: '',
        id: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row, index) {
      this.editIndex = index
      this.temp = Object.assign({}, row) // copy obj
      this.temp.created_at = new Date(this.temp.created_at)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    // 创建/修改
    confirm() {
      // 修改
      this.$refs['dataForm'].validate(valid => {
        valid && (this.editIndex === -1 ? this.Createdata() : this.UpdateData())
      })
      this.dialogFormVisible = false
      // 新增
    },
    // 新增
    Createdata() {
      mobileCreate().then(res => {
        this.editIndex = -1
      }
      )
    },
    // 修改
    UpdateData() {
      mobileUpdate().then(res => {
        const index = this.list.findIndex(v => v.id === this.list[this.editIndex].id)
        if (index === -1) return
        this.list.splice(index, 1, { ...this.temp })
        // this.$set(this.list[index], 'title', this.temp.title)
        this.editIndex = -1
      })
    },
    // 跳转到详情页面
    todetail(item, index) {
      this.$router.push({
        name: 'MobildEdit',
        query: {
          id: item.id
        }
      })
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
