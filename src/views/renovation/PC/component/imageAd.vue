<template>
  <div>
      <div  v-for="(item, index) in list" :key="index">
        <img v-if="item.src" :src="item.src" style="width: 100%;height: 100%;" />
        <img v-else src="../../asset/default.jpg" style="width: 100%;height: 100%;" />
      </div>
   <el-card class="box-card" v-if="!list.length">
     <div slot="header" class="clearfix d-flex align-items-center justify-content-center">
       <span>【图片广告模块请点击关联数据】</span>
     </div>
   </el-card>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style></style>
