<template>
  <div class="vip">
    <img class="pay" src="./image/buy.png" alt="10元领取" />
  </div>
</template>
<style lang="scss" scoped>
@keyframes animate {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
}

.vip {
  position: relative;
  height: 100%;
  background: url('./image/back.png') no-repeat;
  background-size: cover;

  .pay {
    position: absolute;
    width: 264px;
    height: 102px;
    bottom: 50px;
    right: 110px;
    animation: animate 700ms linear infinite alternate;
  }
}
</style>
