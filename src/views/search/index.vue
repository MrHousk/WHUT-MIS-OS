<template>
	<div class="search-container">
    <el-menu mode="horizontal" :default-active="activeIndex" router>
      <el-menu-item index="content" :route="{name: 'content', query: {word: $route.query.word}}">算法</el-menu-item>
      <el-menu-item index="discuss" :route="{name: 'discuss', query: {word: $route.query.word}}">讨论</el-menu-item>
    </el-menu>
    <div class="main">
      <transition name="zoom" mode="out-in">
        <keep-alive include="exercise">
          <router-view :key="$route.path.replace(/\//g, '_')"></router-view>
        </keep-alive>
      </transition>
    </div>
	</div>
</template>

<script>
	export default {
    computed: {
      activeIndex: function () {
        const firstIndex = this.$route.path.indexOf('/')
        const secondIndex = this.$route.path.indexOf('/', firstIndex + 1)
        return this.$route.path.substring(secondIndex + 1);
      }
    }
	}

</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";
	.search-container {
		height: 100%;
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
    &>>>.el-menu--horizontal {
      background-color: $color-mainArea;
      width: 780px;
      margin: 0 auto;
      .el-menu-item:hover, .el-menu-item:focus {
        background-color: $color-mainArea;
      }
    }
    .main {
      height: calc(100vh - 120px);
      width: 100%;
      box-sizing: border-box;
      padding-top: 8px;
      overflow: auto;
    }
	}

</style>
