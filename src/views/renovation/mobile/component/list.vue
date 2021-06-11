<template>
  <div>
    <div style="height: 5px;background-color: #eee;"></div>
    <el-card body-style="{'padding':'10px'}">
      <div slot="header" class="d-flex align-items-center" style="justify-content: space-between;">
        <span>{{title}}</span>
        <el-button type="text" v-if="showMore">查看全部</el-button>
      </div>
      <div>
        <div class="d-flex align-items-center justify-content-center" v-if="!list.length">【列表模块请点击关联数据】</div>
         <el-row :gutter="20">
           <!-- 单列和双列 -->
           <el-col  :span="listType=='one'?24:12" v-for="(item,index) in list" :key="index">
             <div style="margin-bottom: 10px;" :style="listType=='one'?'align-items: flex-start;display: flex;':'align-items:flex-start'"  >
               <img :src="item.cover" style="width: 150px;height: 80px;" />
               <div class="d-flex flex-column" :style="listType=='one'?'margin-left: 5px;':''">
                 <span style="font-size: 14px;">{{item.title}}</span>
                 <span style="font-size: 12px; color: #C0BFC1;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.try_content}}</span>
                 <div>
                   <span class="text-danger" style="font-size: 18px;">￥{{item.price}}</span>
                   <span
class="text-muted "
style="font-size: 10px;margin-left: 5px;color: #C0BFC1;
    text-decoration-line: line-through;">￥{{item.total_price}}</span>
                 </div>
               </div>
             </div>
           </el-col>
           <!-- <el-col :span="24">1</el-col> -->
         </el-row>
      </div>
    </el-card>
  </div>

</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    listType: {
      type: String,
      default: 'two' // 单栏
    }
  }
}
</script>

<style>
</style>
