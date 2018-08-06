<template>
  <div class="circles">
    <div class="circle circle1"></div>
    <div class="circle circle2"></div>
    <div class="circle circle3"></div>
    <div class="circle circle4"></div>
  </div>
</template>

<script>
  export default {
    name: 'm-loading'
  }

</script>

<style lang="scss">
  @import '../styles/vars.css';
  .circles {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    & .circle{
      width: 0.5em;
      height: 0.5em;
      border-radius: 50px;
      background-color: var(--color-blue);
      &:not(:last-child) {
        margin-right: 12px;
      }
    }
    .circle1 {
      animation: circle1 0.8s infinite alternate linear;
    }
    .circle2 {
      animation: circle2 0.8s infinite alternate linear;
    }
    .circle3 {
      animation: circle3 0.8s infinite alternate linear;
    }
    .circle4 {
      animation: circle4 0.8s infinite alternate linear;
    }
  }

  @keyframes circle1 {
    0% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(10px);
    }
  }
  @keyframes circle2 {
    0% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(5px);
    }
  }
  @keyframes circle3 {
    0% {
      transform: translateY(5px);
    }
    100% {
      transform: translateY(-5px);
    }
  }
  @keyframes circle4 {
    0% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(-10px);
    }
  }

</style>
