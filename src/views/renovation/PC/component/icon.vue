<template>
  <div>
    <el-row :gutter="20" class="p-2">
      <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
        <div class="d-flex align-items-center flex-column  justify-content-center  shadow" style="padding: 0;">
          <img class="" :src="item.src" style="width: 150px;height: 60px;"/>
          <span style="font-size: 14px;" class="p-2">{{item.name}}</span>
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
  .shadow{
    box-shadow: 0 6px 10px 0 #ddd;
  }
</style>
