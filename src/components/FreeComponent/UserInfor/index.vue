<template>
  <el-dialog title="用户详情" :visible.sync="dialogvisible" @close="close" width="80%" top="5vh">
    <el-container>
      <el-header style="height: 14vh;" class=" border-bottom">
        <el-row :gutter="20">
          <el-col :span="6">
            <p>ID: {{detail.id}}</p>
          </el-col>
          <el-col :span="6">
            <p>用户名: {{detail.username}}</p>
          </el-col>
          <el-col :span="6">
            <p>昵称: {{detail.nickname||'昵称'}}</p>
          </el-col>
          <el-col :span="6">
            <p>手机号: {{detail.phone}}</p>
          </el-col>
          <el-col :span="6">
            <p>锁定: {{detail.status?'是':'否'}}</p>
          </el-col>
          <el-col :span="6">
            <p>会员: {{detail.user_level}}</p>
          </el-col>
          <el-col :span="6">
            <p>会员到期时间: {{detail.user_level_expire}}</p>
          </el-col>
          <el-col :span="6">
            <p>注册时间: {{detail.created_at}}</p>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="height: 50vh;" class="mb-2 border-bottom">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.label" :name="item.name">
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column v-for="(iitem,iindex) in item.ths" :key="iindex" :prop="iitem.prop" :label="iitem.label">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-footer>
        <el-pagination
@current-change="handleCurrentChange"
:current-page="currentPage4"
:page-size="20"
          layout="total, prev, pager, jumper"
:total="total">
        </el-pagination>
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
import {
  fetchDetail,
  fetchUsercourse
} from '@/api/user.js'

export default {
  data() {
    return {
      dialogvisible: false,
      id: 0,
      total: 10,
      currentPage4: 1,
      detail: {
        avatar: '',
        created_at: '',
        id: 0,
        nickname: '',
        phone: 0,
        status: 0,
        user_level: '',
        user_level_expire: '',
        username: ''
      },
      // tabs选项卡列表
      tabsList: [{
        label: '课程订阅',
        name: 'course',
        ths: [{
          label: '课程标题',
          prop: 'title'
        },
        {
          label: '购买价格',
          prop: 'price'
        },
        {
          label: '购买时间',
          prop: 'created_at'
        }
        ]
      },
      {
        label: '专栏订阅',
        name: 'column',
        ths: [{
          label: '专栏标题',
          prop: 'title'
        },
        {
          label: '购买价格',
          prop: 'price'
        },
        {
          label: '购买时间',
          prop: 'created_at'
        }
        ]
      },
      {
        label: '订单记录',
        name: 'order',
        ths: [{
          label: 'ID',
          prop: 'id'
        },
        {
          label: '订单号',
          prop: 'no'
        },
        {
          label: '购买价格',
          prop: 'price'
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '商品',
          prop: 'title'
        },
        {
          label: '购买时间',
          prop: 'created_at'
        }
        ]
      },
      {
        label: '观看历史',
        name: 'history',
        ths: [{
          label: '课程标题',
          prop: 'title'
        },
        {
          label: '课程类型',
          prop: 'type'
        },
        {
          label: '学习时长',
          prop: 'total_time'
        }
        ]
      },
      {
        label: '用户评论',
        name: 'comment',
        ths: [{
          label: '评论内容',
          prop: 'content'
        },
        {
          label: '评论时间',
          prop: 'created_at'
        },
        {
          label: '课程标题',
          prop: 'title'
        },
        {
          label: '课程类型',
          prop: 'type'
        }
        ]
      }
      ],
      activeName: 'course',
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        type: 'course'
      }
    }
  },
  methods: {
    open(id) {
      this.id = id
      this.Getdetail(id)
      this.dialogvisible = true
      this.fetList()
    },
    close() {
      this.dialogvisible = false
    },
    GetList() {
      fetchUsercourse(this.listQuery).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    handleClick(tab, event) {
      this.currentPage4 = 1
      this.listQuery.page = 1
      this.$nextTick(() => {
        this.$set(this.listQuery, 'page', 1)
      })
      this.listQuery.type = this.activeName
      this.GetList()
    },
    handleCurrentChange(val) {
      this.currentPage4 = val
      this.listQuery.page = val
      this.GetList()
    },
    Getdetail(id) {
      fetchDetail({
        id
      }).then(res => {
        this.detail = Object.assign({}, res.data.user)
      })
    },
    fetList() {
      this.GetList()
    }
  }
}
</script>

<style>
</style>
