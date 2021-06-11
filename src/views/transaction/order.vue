<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: flex; justify-content: space-between;">
        <el-button
          :loading="downloadLoading"
          @click="handleDownload"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          :disabled="ableexport"
          icon="el-icon-edit">
          导出excel
        </el-button>
        <div>
          <el-input
v-model="listQuery.title"
placeholder="订单号"
style="width: 200px;margin-right: 15px;"
            class="filter-item"
@keyup.enter.native="handleFilter" />
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
ref="ordertable"
style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>

      <el-table-column
          label="ID"
          prop="id"
          align="center"
          width="80"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="180px" align="center">
        <template slot-scope="{row}">
          {{ row.title }}
          <p v-for="(item,index) in row.goods" :key="index">
            {{item.title}}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.type | typefilter }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status?'success':'danger'">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="原价/实付(元)" width="120px" align="center">
        <template>
          <div class="d-flex  justify-content-center" style="align-items: center;">
            <p class="text-secondary">10/</p>
            <p class="text-danger">8</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="80px" align="center">
        <template slot-scope="{row}">
          <p>{{row.pay_method | paymthodfilter}}</p>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="{row}">
          <p>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</p>
          <p>{{ row.pay_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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
  </div>
</template>

<script>
const statusOptions = {
  fail: '失败',
  success: '成功',
  pending: '支付中'
}
const payOptions = {
  wechat: '微信支付'
}
const typeOptions = {
  default: '正常',
  group: '拼团'
}
import {
  fetchList
  // updateMedia
  // deleteMedia
} from '@/api/order.js'
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
  computed: {
    ableexport() {
      return this.multipleSelection.length === 0
    }
  },
  filters: {
    parint(str) {
      return parseInt(str)
    },
    statusFilter(status) {
      return statusOptions[status]
    },
    paymthodfilter(pay) {
      return payOptions[pay]
    },
    typefilter(type) {
      return typeOptions[type]
    }
  },
  data() {
    return {
      downloadLoading: false,
      tableKey: 0,
      list: null,
      total: 0,
      dialogVisible: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      multipleSelection: [],
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
        id: undefined,
        cover: '',
        created_at: new Date(),
        title: '',
        type: '',
        price: 0,
        status: 0,
        try_content: '',
        content: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.data
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
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleChange(value) {
      console.log(value)
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
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = {
        try_content: '',
        content: '',
        id: undefined,
        cover: '',
        created_at: new Date(),
        title: '',
        type: '',
        price: 1,
        status: 0
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 导出表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '商品名称', '订单类型','订单状态', '原价', '实付', '支付方式',
          '创建日期', '付款日期'
        ]
        const list = this.multipleSelection.map(v => {
          let o = {...v}
          o.goods = v.goods.map(item => item.title).join(',')
          o.pay_method = payOptions[v.pay_method]
          o.type = typeOptions[v.type]
          o.status = statusOptions[v.status]
          return o
        })
        const filterVal = ['ID', 'goods', 'type','status', 'total_price', 'price', 'pay_method', 'created_at', 'pay_at']
        console.log(list);
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
        this.$refs.ordertable.clearSelection()
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
  p {
    margin: 0;
    padding: 0;
  }
</style>
