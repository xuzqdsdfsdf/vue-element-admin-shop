<template>
  <el-dialog :modal-append-to-body="false" append-to-body	 :visible.sync="dialogvisible" @close="close" width="70%" top="5vh">
    <el-header>
      <!-- 搜索栏 -->
      <div style="display: flex; align-items: center;">
        <div style="margin-left: auto;">
          <el-select
            v-model="listQuery.status"
            placeholder="状态"
            clearable
            size="mini"
            style="width: 90px;margin-right: 15px;"
class="filter-item">
            <el-option v-for="(item,k) in statusOptions" :key="k" :label="item" :value="k| parint" />
          </el-select>
          <el-input
            size="mini"
            v-model="listQuery.title"
            placeholder="Title"
            style="width: 200px;margin-right: 15px;"
            class="filter-item"
@keyup.enter.native="handleFilter" />
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="180px" style="height: 55vh;margin: 0;padding: 0; border: ">
        <!-- 侧边栏 -->
        <el-menu @select="handleSelect" background-color="#EFF1F6" :default-active="key" style="border: none;">
          <el-menu-item :index="item.value" :key="index" v-for="(item,index) in selectvalue">
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main style="height: 55vh;margin-top: 0;padding-top: 0;margin-bottom: 20px;">
          <!-- 主表单 -->
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中"
            :data="list"
            border
            fit
            highlight-current-row
            @selection-change="handleSelectionChange"
style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
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
            <el-table-column label="状态" class-name="status-col" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status?'success':'danger'">
                  {{ row.status | statusFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleUpdate(row)">
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 底部分页 -->
        <el-footer>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-size="20"
            layout="total, prev, pager, jumper"
            :total="total">
          </el-pagination>
        </el-footer>
      </el-container>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const statusOptions = {
  1: '已上架',
  0: '已下架'
}
const M = {}
function importall(r) {
  r.keys().forEach((key) => {
    M[key] = r(key)
  })
}
// 相当于引入api目录下的所有文件
importall(require.context('@/api/', true, /\.js$/))
export default {
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
      key: 'media',
      list: [],
      tableKey: 0,
      listLoading: false,
      currentPage4: 1,
      selectvalue: [{
        name: '图文',
        value: 'media'
      },
      {
        name: '音频',
        value: 'audio'
      },
      {
        name: '视频',
        value: 'video'
      }
      ],
      dialogvisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        isend: 0, // 连载状态
        status: undefined,
        title: undefined,
        sort: '+id'
      },
      activeIndex: '1',
      statusOptions,
      multipleSelection: [],
      total: 0,
      callback: null
    }
  },
  created() {

  },
  methods: {
    // 侧边栏选择
    handleSelect(key, keyPath) {
      this.key = key
      this.getList()
      console.log(key, keyPath)
    },
    open(callback, limit) {
      this.limit = parseInt(limit) || 6
      this.listQuery.page = 1
      this.getList()
      this.dialogvisible = true
      if (typeof callback === 'function') {
        this.callback = callback
      }
    },
    close() {
      this.dialogvisible = false
    },
    confirm() {
      if (!this.multipleSelection.length) {
        return this.$message.error('至少选中一项')
      }
      if (this.multipleSelection.length > this.limit) {
        return this.$message.error('最多可选择' + this.limit + '项')
      }
      this.callback(this.multipleSelection)
      this.multipleSelection = []
      this.close()
    },
    handleFilter() {

    },
    getList() {
      this.listLoading = true
      console.log(M[`./${this.key}.js`].fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      }))
      // fetchList(this.listQuery).then(response => {
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //     this.list = response.data.items
      //     this.total = response.data.total
      //   }, 1500)
      // })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    }
  }
}
</script>

<style>
</style>
