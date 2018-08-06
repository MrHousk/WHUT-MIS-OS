<template>
  <div class="teacher-container">
    <div class="teacher">
      <el-menu :default-active="activeTab" mode="horizontal" router>
        <el-menu-item v-if="$store.getters.accountIdentity == 'admin'" index="question-bank-manage">题库管理</el-menu-item>
        <el-menu-item v-if="$store.getters.accountIdentity == 'admin'" index="manage-resource">课件管理</el-menu-item>
        <el-menu-item v-if="$store.getters.accountIdentity == 'admin'" index="academic">学情分析</el-menu-item>
      </el-menu>

      <div class="main">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <router-view :key="$route.path.replace(/\//g, '_')"></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      activeTab: function () {
        return this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .teacher-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .teacher {
			flex: 1 0;
      width: 800px;
      box-sizing: border-box;
      margin: auto;
      background-color: $color-white;
      border: 1px solid $color-greyLine;
      .main {
        height: calc(100% - 61px);
        box-sizing: border-box;
        padding: 15px;
        overflow: auto;
      }
    }
  }
</style>
