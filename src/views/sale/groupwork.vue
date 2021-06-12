<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: flex; justify-content: space-between;">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          新增拼团
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
      <el-table-column label="拼团课程" width="250" align="">
        <template slot-scope="{ row }">
          <div
            class="d-flex "
            style="flex:1;align-items:center;jusity-content:flex-start"
          >
            <img :src="row.value.cover" style="width:80px;height:50px" />
            <div class="d-flex flex-column " style="margin-left:10px;">
              <span class="text-over" style="color:#4091F7;flex:1">{{
                row.value.title
              }}</span>
              <div>
                原始价格：<span style="color:red">￥{{ row.price }}</span>
              </div>
              <div>
                拼团价格：<span style="color:red">￥{{ row.value.price }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="成团人数" align="center" prop="p_num" />
      <el-table-column label="拼团价" align="center" prop="price" />
      <el-table-column
        label="拼团时限(小时)"
        width="120"
        align="center"
        prop="expire_time"
      />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="{ row }">
          <span :style="{ color: row.status ? 'red' : '#909399' }">{{
            row.status ? "上架" : "下架"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼团状态" align="center" prop="price">
        <template slot-scope="scope">
          <span>{{ scope | formattime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row, $index)"
          >
            编辑
          </el-button>
          <el-button
            @click="offaction(row)"
            :disabled="!row.status"
            :type="row.status ? 'danger' : 'success'"
            size="mini"
          >
            {{ row.status ? "下架" : "上架" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      top="5vh"
      
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 1000px; margin-left:50px;"
      >
        <el-form-item label-width="150px" label="类型" prop="title">
          <el-select v-model="temp.type" placeholder="请选择类型">
            <el-option label="课程" value="course" />
            <el-option label="专栏" value="column" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="150px" label="关联课程">
          <el-button type="primary">{{
            temp.type == "course" ? "课程" : "专栏"
          }}</el-button>
        </el-form-item>
        <el-form-item label-width="150px" label="拼团价">
          <el-input-number
            v-model="temp.price"
            @change="handleChange('price', $event)"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="拼团人数" prop="p_num">
          <el-input-number
            v-model="temp.p_num"
            @change="handleChange('p_num', $event)"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="是否开启凑团" prop="auto">
          <el-radio-group v-model="temp.auto">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-width="150px" label="拼团时限" prop="expire_time">
          <el-radio-group v-model="temp.expire_time">
            <el-radio :label="24">24小时</el-radio>
            <el-radio :label="48">48小时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label-width="160px"
          label="拼团开启-结束时间"
        >
           <el-date-picker
            v-model="timerange"
            type="datetimerange"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH-mm-SS"
            end-placeholder="结束日期"
            @change="handletimer"
            :default-time="['00:00:00']">
    </el-date-picker>
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
  1: "已上架",
  0: "已下架"
};
const timerstatus = {
  0: "未开始",
  1: "拼团中",
  2: "已下架"
};
import { fetchGroup, createGroup, updateGroup } from "@/api/sale.js";
import banks from "@/utils/bank.js";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "ComplexTable",
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    parint(str) {
      return parseInt(str);
    },
    statusFilter(status) {
      return statusOptions[status];
    }
  },
  computed:{
    timerange:{
      get()
      {
        return [this.temp.start_time,this.temp.end_time]
      },
      set(val)
      {
        this.temp.start_time = val[0]
        this.temp.end_time = val[1]
      }
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
        sort: "+id"
      },
      importanceOptions: [1, 2, 3],
      statusOptions,
      showReviewer: false,
      temp: {
        id: 0,
        type: "course",
        value: null,
        price: 10.0,
        p_num: 2,
        status: 0,
        auto: 1,
        expire_time: 24, //过期时间
        start_time: "",
        end_time: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        title: [
          {
            required: true,
            message: "页面标题不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.banks = banks.getBank();
  },
  filters: {
    formattime(item) {
      let status = 0;
      let start_time = new Date(item.start_time).getTime();
      let end_time = new Date(item.end_time).getTime();
      let now_time = new Date().getTime();
      if (start_time < now_time) {
        status = 0;
      } else if (start_time < now_time && now_time < end_time) {
        status = 1;
      } else if (now_time > end_time) {
        status = 2;
      }
      return timerstatus[status];
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchGroup().then(response => {
        // Just to simulate the time of the request
        console.log(response);
        console.log(response.data);
        setTimeout(() => {
          this.list = response.data.data;
          this.total = response.data.total;
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    cancelbtn() {
      this.temp = {
        title: ""
      };
      this.dialogFormVisible = false;
    },
    handlechoose(e, k) {
      this.temp[k] = e.value;
    },
    resetTemp() {
      this.temp = {
        id: 0,
        type: "course",
        value: null,
        price: 10.0,
        p_num: 2,
        status: 0,
        auto: 1,
        expire_time: 24, //过期时间
        start_time: "",
        end_time: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    offaction(item) {
      this.$confirm("是否要下架该活动", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "下架成功"
          });
          item.status = 0;
        })
        .catch(err => {});
    },
    handletimer(e)
    {

    },
    handleUpdate(row, index) {
      this.editIndex = index;
      this.temp = Object.assign({}, row); // copy obj
      this.timerange = [row.start_time,row.end_time]
      console.log(this.timerange);
      this.temp.created_at = new Date(this.temp.created_at);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 修改数量
    handleChange(type, value) {
      this.temp[type] = value;
    },
    handleDelete(row, index) {
      this.$notify({
        title: "提示",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      this.list.splice(index, 1);
    },
    // 创建/修改
    confirm() {
      // 修改
      this.$refs["dataForm"].validate(valid => {
        valid &&
          (this.editIndex === -1 ? this.Createdata() : this.UpdateData());
      });
      this.dialogFormVisible = false;
      // 新增
    },
    // 新增
    Createdata() {
      mobileCreate().then(res => {
        this.editIndex = -1;
      });
    },
    // 修改
    UpdateData() {
      mobileUpdate().then(res => {
        const index = this.list.findIndex(
          v => v.id === this.list[this.editIndex].id
        );
        if (index === -1) return;
        this.list.splice(index, 1, { ...this.temp });
        // this.$set(this.list[index], 'title', this.temp.title)
        this.editIndex = -1;
      });
    },
    // 跳转到详情页面
    todetail(item, index) {
      this.$router.push({
        name: "MobildEdit",
        query: {
          id: item.id
        }
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "created_at") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>
<style>
.text-over {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 130px;
}
</style>
