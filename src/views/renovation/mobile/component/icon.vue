<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
        <div class="d-flex align-items-center flex-column p-1 justify-content-center">
          <img class="rounded-circle" :src="item.src" style="width: 50px;height: 50px;"/>
          <span style="font-size: 14px;">{{item.name}}</span>
        </div>
      </el-col>
    </el-row>
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

<style>
</style>
