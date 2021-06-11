<template>
  <div class="footer-page">
    <div>
      <a></a>
    </div>
    <div class="d-flex align-items-center justify-content-center text-white flex-column">
      <div>
        <a class="m-2 " style="flex:1;flex-shrink: 1;" v-for="(item,index) in list " :key="index">{{item.title}}</a>
      </div>
      <div class="mt-2">@ 2021 xzqfm.com <a>ICP备 xxxxxxxxx号-xx</a></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '企业服务'
        },
        {
          title: '企业服务'
        },
        {
          title: '企业服务'
        },
        {
          title: '企业服务'
        },
        {
          title: '企业服务'
        },
        {
          title: '企业服务'
        }
      ]
    }
  }
}
</script>

<style>
  .footer-page{
    background-color: #1F2227;
    padding: 30px;
    font-size:13px;
  }
</style>
