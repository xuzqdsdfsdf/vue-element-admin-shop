<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix d-flex align-items-center " style="justify-content: space-between;">
              <span>可用余额(元)</span>
              <el-button size="small" type="primary" @click="opendia">申请提现</el-button>
            </div>
            <div class="pt-3">
              <h2>20.00</h2>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix d-flex align-items-center " style="justify-content: space-between;">
              <span>累计收入(元)</span>
            </div>
            <div class="pt-3">
              <h2>20.00</h2>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix d-flex align-items-center " style="justify-content: space-between;">
              <span>待结算金额</span>
            </div>
            <div class="pt-3">
              <h2>20.00</h2>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix d-flex align-items-center " style="justify-content: space-between;">
              <span>冻结金额</span>
            </div>
            <div class="pt-3">
              <h2>20.00</h2>
            </div>
          </el-card>
        </el-col>
      </el-row>

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
      <el-table-column
label="ID"
prop="id"
sortable="custom"
align="center"
width="80"
        >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="交易时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提款账号" width="200px" align="center">
        <template slot-scope="{row}">
          {{ row.account }}
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" align="center">
        <template slot-scope="{row}">
          {{row.name}}
        </template>
      </el-table-column>
      <el-table-column label="提款金额" class-name="status-col" align="center">
        <template slot-scope="{row}">
          {{row.price}}
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" align="center">
        <template slot-scope="{row}">
          {{row.status | statusFilter}}
        </template>
      </el-table-column>
    </el-table>
    <pagination
v-show="total>0"
:total="total"
:page.sync="listQuery.page"
:limit.sync="listQuery.limit"
      @pagination="getList" />

    <el-dialog title="申请提现" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="detail"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label-width="100px" label="提现金额" prop="price">
          <el-input-number v-model="detail.price" :min="1" label="提现金额" @change="handleChange" />
        </el-form-item>
        <el-form-item label="提现账户" label-width="100px" prop="account_id">
          <el-select v-model="detail.account_id" placeholder="请选择">
             <el-option
                  v-for="(item) in accounts"
                  :key="item.id"
                  :label="item.account"
                  :value="item.id">
                  <span style="float: left">{{ item.bank }}</span>
                  <span class="" style="margin-left:20px;float: right; color: #8492a6; font-size: 13px">{{ item.account }}</span>
                </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button >
          取消
        </el-button>
        <el-button type="primary" @click="cashout">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const statusOptions = {
  1: '审核通过',
  0: '审核中',
  2: '审核失败'
}
import {
  fetchList,
  FetchPovertyset,
  Cashount
  // deleteMedia
} from '@/api/poverty.js'
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
      tableKey: 0,
      list: null,
      total: 0,
      dialogVisible: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      detail: {
        account_id: '',
        price: 0
      },
      accounts: [],
      statusOptions,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        price: [{
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error('提现金额不能为0'))
            } else if (value > 20) {
              return callback(new Error('提现金额不能大于20'))
            }
            callback()
          }
        }],
        account_id: [{
          required: true,
          message: '提现账户不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getList()
    FetchPovertyset().then(res => {
      this.accounts = res.data.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    opendia() {
      this.detail = {
        account_id: '',
        price: 1
      }
      this.dialogFormVisible = true
    },
    handleChange(value) {
      console.log(value)
    },
    // 创建提现申请
    cashout() {
      console.log(123)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          Cashount(this.detail).then(res => {
            this.$message({
              type: 'success',
              message: '提交成功,等待审核'
            })
            this.list.unshift(res.data)
            this.dialogFormVisible = false
            this.total += 1
          })
        }
      })
    },
    handlePictureCardPreview(file) {
      this.temp.avatar = file.url
      this.dialogVisible = true
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
    }
  }
}
</script>
