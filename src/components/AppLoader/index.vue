<template>
  <div class="loader">
    <div class="loader_overlay"></div>
    <div class="loader_cogs">
      <div class="loader_cogs__top">
        <div class="top_part"></div>
        <div class="top_part"></div>
        <div class="top_part"></div>
        <div class="top_hole"></div>
      </div>
      <div class="loader_cogs__left">
        <div class="left_part"></div>
        <div class="left_part"></div>
        <div class="left_part"></div>
        <div class="left_hole"></div>
      </div>
      <div class="loader_cogs__bottom">
        <div class="bottom_part"></div>
        <div class="bottom_part"></div>
        <div class="bottom_part"></div>
        <div class="bottom_hole"></div>
      </div>
      <p>loading...</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
/* Animations */
@keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotate_left {
  from {
    -webkit-transform: rotate(16deg);
    transform: rotate(16deg);
  }
  to {
    -webkit-transform: rotate(376deg);
    transform: rotate(376deg);
  }
}
@keyframes rotate_right {
  from {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }
  to {
    -webkit-transform: rotate(364deg);
    transform: rotate(364deg);
  }
}
.loader {
  height: 100%;
  position: relative;
  margin: auto;
  width: 400px;
  .loader_overlay {
    width: 150px;
    height: 150px;
    background: transparent;
    box-shadow: 0px 0px 0px 1000px rgba(255, 255, 255, 0.67),
      0px 0px 19px 0px rgba(0, 0, 0, 0.16) inset;
    border-radius: 100%;
    z-index: -1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .loader_cogs {
    z-index: -2;
    width: 100px;
    height: 100px;
    top: -120px !important;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    p {
      text-align: center;
    }
    .loader_cogs__top {
      position: relative;
      width: 100px;
      height: 100px;
      transform-origin: 50px 50px;
      animation: rotate 10s infinite linear;
      .top_part {
        width: 100px;
        border-radius: 10px;
        position: absolute;
        height: 100px;
        background: #f98db9;
        &:nth-of-type(1) {
          transform: rotate(30deg);
        }
        &:nth-of-type(2) {
          transform: rotate(60deg);
        }
        &:nth-of-type(3) {
          transform: rotate(90deg);
        }
      }
      .top_hole {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background: white;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .loader_cogs__left {
      position: relative;
      width: 80px;
      transform: rotate(16deg);
      top: 28px;
      transform-origin: 40px 40px;
      animation: rotate_left 10s 0.1s infinite reverse linear;
      left: -24px;
      height: 80px;
      .left_part {
        width: 80px;
        border-radius: 6px;
        position: absolute;
        height: 80px;
        background: #97ddff;
        &:nth-of-type(1) {
          transform: rotate(30deg);
        }
        &:nth-of-type(2) {
          transform: rotate(60deg);
        }
        &:nth-of-type(3) {
          transform: rotate(90deg);
        }
      }
      .left_hole {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background: white;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .loader_cogs__bottom {
      position: relative;
      width: 60px;
      top: -65px;
      transform-origin: 30px 30px;
      animation: rotate_left 10.2s 0.4s infinite linear;
      transform: rotate(4deg);
      left: 79px;
      height: 60px;
      .bottom_part {
        width: 60px;
        border-radius: 5px;
        position: absolute;
        height: 60px;
        background: #ffcd66;
        &:nth-of-type(1) {
          transform: rotate(30deg);
        }
        &:nth-of-type(2) {
          transform: rotate(60deg);
        }
        &:nth-of-type(3) {
          transform: rotate(90deg);
        }
      }
      .bottom_hole {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background: white;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
}
</style>
