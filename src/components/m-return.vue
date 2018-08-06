<template>
  <div class="page-return">
    <i class="el-icon-d-arrow-left" @click="$emit('page-return');$emit('click')"></i>
  </div>
</template>

<script>
  export default {
		name: 'm-return'
  }

</script>

<style lang="scss" scoped>
@import "~@/styles/vars.scss";
  .page-return {
    margin-left: 0.5em;
    cursor: pointer;
    align-self: flex-start;
    position: absolute;
    top: 12px;
    [class^="el-icon-"] {
      @media only screen and (min-device-width: 1920px) {
        font-size: 1.8rem;
      }
      font-size: 1.6rem;
      color: $color-theme;
      transition: 0.4s linear;
    }
    [class^="el-icon-"]:hover {
      transform: translateX(-4px);
    }
  }

</style>
