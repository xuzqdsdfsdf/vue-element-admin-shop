<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: flex; justify-content: space-between;">
        <el-dropdown>
          <el-button type="danger">
            黑名单设置<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>禁止访问</el-dropdown-item>
            <el-dropdown-item>禁止评论</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div>
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
    >
      <el-table-column label="用户" align="center" width="450px">
        <template slot-scope="{row}">
          <div style="display: flex;" class="align-items-start">
            <img :src="row.user.avatar" class="rounded-circle" style="width: 50px;height: 50px;">
            <div style="display: flex; flex-direction: column; justify-content: center" class="px-1">
              <span>{{ row.user.username }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="消费总额" width="200px" align="center">
        <template slot-scope="{row}">
          {{ row.total_price }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div class="d-flex align-items-center justify-content-center">
            <el-button type="primary" size="mini" @click="openUserinf(row.user.id)">
              详情
            </el-button>
            <el-button size="mini" type="success" >
              联系用户
            </el-button>
            <div>
              <el-dropdown class="ml-1 border-bottom" style="margin-left: 10px;">
                <el-button type="danger"  size="mini">
                  黑名单设置<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>禁止访问</el-dropdown-item>
                  <el-dropdown-item>禁止评论</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <user-infor ref="userinfor"></user-infor>
  </div>
</template>

<script>
import userInfor from '@/components/FreeComponent/UserInfor/index.vue'
import {
  fetchList
} from '@/api/user.js'
import waves from '@/directive/waves' // waves directive
// import {
//   parseTime
// } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    userInfor
  },
  directives: {
    waves
  },
  filters: {
    parint(str) {
      return parseInt(str)
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
        limit: 20,
        title: ''
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
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    openUserinf(id) {
      this.$refs.userinfor.open(id)
    }
  }
}
</script>
