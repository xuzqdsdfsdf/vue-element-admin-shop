<template>
  <div>
    <div style="height: 5px;background-color: #eee;"></div>
    <el-card body-style="{'padding':'10px'}">
      <div slot="header" class="d-flex align-items-center" style="justify-content: space-between;">
        <span>{{title || (listType=='group'?'拼团':'限时秒杀')}}</span>
      </div>
      <div>
        <div class="d-flex align-items-center justify-content-center" v-if="!list.length">【列表模块请点击关联数据】</div>
        <div style="overflow-x: auto;display: flex; " v-else>
          <div v-for="(item,index) in list" :key="index" style="margin: 0 10px;display: inline-block;min-width: 150px;">
            <div style="margin-bottom: 10px;" >
              <img :src="item.cover" style="width:100%;height: 80px;" />
              <div class="d-flex flex-column" :style="listType=='one'?'margin-left: 5px;':''">
                <span style="font-size: 14px;">{{item.title}}</span>
                <span
                  style="font-size: 12px; color: #C0BFC1;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.try_content}}</span>
                <div>
                  <span class="text-danger" style="font-size: 18px;">{{listType=='group'?'拼团':'限时秒杀'}}￥{{item.price}}</span>
                  <span
class="text-muted "
style="font-size: 10px;margin-left: 5px;color: #C0BFC1;
                           text-decoration-line: line-through;">￥{{item.total_price||0}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
