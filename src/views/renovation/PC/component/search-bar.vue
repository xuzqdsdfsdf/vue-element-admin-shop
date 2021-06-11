<template>
  <div class="search-bar-box">
    <div class="search-bar">
      <i class="el-icon-search"></i>
      <span>{{placeholder}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
  .search-bar-box{
    padding: 10px;
  }
  .search-bar{
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(248,248,248);
    color: #b7b6b8;
    border: 1px solid #ccc;
  }
  .search-bar i{
    font-size: 20px;
    color: #b7b6b8;
    margin-right: 10px;
  }
</style>
