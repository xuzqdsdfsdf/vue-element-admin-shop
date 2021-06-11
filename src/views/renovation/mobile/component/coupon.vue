<template>
  <div>
    <div class="coupon-container">
      <div class="d-flex  text-white p-1" v-for="(item,index) in list" :key="index">
        <div style="background-color: #D7A837;min-width: 100px;" class="d-flex flex-column justify-content-center align-items-center">
          <span class="py-1" >￥100</span>
          <span class="py-1" >满￥200可用</span>
        </div>
        <div style="background-color: #F3C642;cursor: pointer;min-width: 50px;" class="d-flex p-2  justify-content-center align-items-center">
          <span>领取</span>
        </div>
      </div>
    </div>
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
  .coupon-container {
    display: flex;
    overflow-x: auto;
    width: 100%;
  }
</style>
