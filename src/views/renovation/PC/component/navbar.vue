<template>
  <div class=" p-3" style="">
    <el-row class="p-3 d-flex align-items-center" style="justify-content: space-between;">
      <el-col :span="18">
        <div class="navbarlist ">
          <span class="navbarLogo">LOGO</span>
          <span class=" itemclass" v-for="(item,index) in list" :key="index">{{item.title}}</span>
        </div>
      </el-col>
      <el-col :span="6" style="" class="d-flex align-items-center">
        <i class="el-icon-user-solid text-muted p-2" style="font-size: 25px;"></i>
        <i class="el-icon-phone-outline text-muted p-2" style="font-size: 25px;"></i>
        <i class="el-icon-setting text-muted p-2" style="font-size: 25px;"></i>
        <i class="el-icon-more text-muted p-2" style="font-size: 25px;"></i>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '首页'
        },
        {
          title: '首页0'
        },
        {
          title: '分类1'
        }
      ]
    }
  }
}
</script>

<style>
  .navbarLogo{
    padding: 10px 30px;
    background-color: #EEF1F6;

  }
  .navbarlist{
    font-size: 15px;
  }
  .itemclass{
    padding: 10px 30px;
  }
</style>
