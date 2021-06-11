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
          增加收款账号
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
      @sort-change="sortChange">
      <el-table-column label="提现账号" prop="account" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户人" width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="开户行" align="center">
        <template slot-scope="{row}">
          {{ row.path }}
        </template>
      </el-table-column>
      <el-table-column label="银行卡所属地" align="center">
        <template slot-scope="{row}">
          {{ row.province }}/{{row.city}}/{{row.area}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row,$index)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除该记录吗？" @onConfirm="handleDelete(row,$index)">
            <el-button
v-if="row.status!='deleted'"
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
        <el-form-item label-width="90px" label="账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label-width="90px" label="省市区">
          <v-distpicker
@province="handlechoose($event,'province')"
@city="handlechoose($event,'city')"
            @area="handlechoose($event,'area')"
:province="temp.province"
:city="temp.city"
:area="temp.area">
          </v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址" label-width="90px" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="所属银行" label-width="90px" prop="bank">
          <el-select v-model="temp.bank" placeholder="请选择">
            <el-option v-for="(item) in banks" :key="item.value" :label="item.text" :value="item.text">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" label-width="90px" prop="name">
          <el-input v-model="temp.name" />
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
import Distpicker from 'v-distpicker'
const statusOptions = {
  1: '已上架',
  0: '已下架'
}
import {
  FetchPovertyset,
  CreateAccount,
  DeleteAccount,
  UpdateAccount
  // deleteMedia
} from '@/api/poverty.js'
import banks from '@/utils/bank.js'
import waves from '@/directive/waves' // waves directive
import {
  parseTime
} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    Distpicker
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
      sortOptions: [{
        label: 'ID Ascending',
        key: '+id'
      }, {
        label: 'ID Descending',
        key: '-id'
      }],
      statusOptions,
      showReviewer: false,
      temp: {
        account: '',
        area: '',
        bank: '',
        city: '',
        id: 0,
        name: '',
        path: '',
        province: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        account: [{
          required: true,
          message: '提现账号不能为空',
          trigger: 'blur'
        }],
        bank: [{
          required: true,
          message: '开户银行不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '开户人不能为空',
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: '开户银行地址不能为空',
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
      FetchPovertyset(this.listQuery).then(response => {
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleRemove(file, fileList) {
    },
    handleChange(value) {
    },
    handlesuccess(response, file, fileList) {
      const {
        url
      } = file
      this.temp.cover = url
    },
    handlePictureCardPreview(file) {
      this.temp.avatar = file.url
      this.dialogVisible = true
    },
    cancelbtn() {
      this.temp = {
        account: '',
        area: '',
        bank: '',
        city: '',
        id: 0,
        name: '',
        path: '',
        province: ''
      }
      this.dialogFormVisible = false
    },
    handlechoose(e, k) {
      this.temp[k] = e.value
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
    resetTemp() {
      this.temp = {
        account: '',
        area: '',
        bank: '',
        city: '',
        id: 0,
        name: '',
        path: '',
        province: ''
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
      this.editIndex = -1
      this.dialogFormVisible = false
      // 新增
    },
    // 新增
    Createdata() {
      CreateAccount(this.temp).then(res => {
        this.list.unshift(this.temp)
      })
    },
    UpdateData() {
      UpdateAccount(this.temp).then(res => {
        const index = this.list.findIndex(v => v.id === this.temp.id)
        this.list.splice(index, 1, this.temp)
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
