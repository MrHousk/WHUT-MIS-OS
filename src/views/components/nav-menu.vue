<template>
  <section class="container" :class="{collapse:$store.getters.isCollapse}">
    <div class="hide" @click="$store.commit('changeNavStatus')">
      <i class="el-icon-menu" :class="{collapse:$store.getters.isCollapse}"></i>
    </div>
    <el-menu :collapse="$store.getters.isCollapse">
      <el-menu-item v-for="item in navs" :key="item.index" :index="item.index" @click="$store.commit('changeAlgorithm', item.index.substring(1, item.index.indexOf('/', 1)));$router.push(item.index)">
        <m-icon :name="`${item.icon}`"></m-icon>
        <span slot="title">{{item.text}}</span>
      </el-menu-item>
      <el-menu-item v-if="$store.getters.accountIdentity !== 'admin'" @click="$store.commit('changeAlgorithm', '');$router.push('/semester-test')">
        <m-icon name="kaoshizhongxinon"></m-icon>
        <span slot="title">综合测试</span>
      </el-menu-item>
      <el-menu-item @click="$router.push({name: 'forum'})">
        <m-icon name="taolun"></m-icon>
        <span slot="title">学习讨论区</span>
      </el-menu-item>
    </el-menu>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        navs: [{
          index: '/processorSchedule/algorithm-review',
          text: '处理机调度算法',
          icon: 'cpu'
        }, {
          index: '/banker/algorithm-review',
          text: '银行家算法',
          icon: 'qianmoney125'
        }, {
          index: '/memoryPartition/algorithm-review',
          text: '内存分配算法',
          icon: 'Rectanglex'
        }, {
          index: '/pageReplace/algorithm-review',
          text: '页面置换算法',
          icon: 'yemian'
        }, {
          index: '/diskSchedule/algorithm-review',
          text: '磁盘调度算法',
          icon: 'msnui-disk'
        }, {
          index: '/encryptDecode/algorithm-review',
          text: '加密解密算法',
          icon: 'suo'
        }]
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import '~@/styles/vars.scss';
  .container {
    @media only screen and (min-device-width: 1920px) {
      flex-basis: 200px;
    }
    flex-shrink: 0;
		flex-basis: 190px;
    transition: .6s ease-in-out;
    overflow: hidden;
    background-color: $color-navbg;
  	border-right: 0.5px solid $color-dividingLine;
    .hide {
      @media only screen and (min-device-width: 1920px) {
        flex-basis: 50px;
      }
      flex-basis: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 0.5px solid $color-dividingLine;
      cursor: pointer;
      i {
        transition: transform .6s ease-in-out;
        color: $color-theme;
        font-size: 1.25rem; //图标大小
        &.collapse {
          transform: rotate(180deg); //順時針爲正
        }
      }
    }
    .el-menu--collapse {
      @media only screen and (min-device-width: 1920px) {
        width: 66px;
      }
      width: 62px;
    }
    .el-menu {
      border: none;
      height: 100%;
      background-color: $color-navbg;
      .el-menu-item {
        @media only screen and (min-device-width: 1920px) {
          height:60px;
        }
        font-size: 0.9rem;
        font-weight: 600;
        margin-top: 2px;
        height:56px;
        color: $color-theme;
        .icon {
          width: 1.5em;
          height: 1.5em;
          @media only screen and (min-device-width: 1920px) {
            margin-right: 20px;
          }
          margin-right: 16px;
        }
      }
      .el-menu-item:hover,
      .el-menu-item:focus,
      .el-submenu__title:hover {
        background-color: #E6E7EA;
      }
      .el-menu-item.is-active {
        color: $color-theme;
      }
    }
  }

  .container.collapse {
    @media only screen and (min-device-width: 1920px) {
      flex-basis: 66px;
    }
    flex-basis: 62px;
  }

</style>
