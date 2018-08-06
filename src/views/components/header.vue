<template>
  <div class="header-container">
    <div class="logo">
      <img src="static/pic/logo.png" alt="计算机操作系统教学辅助软件" @dblclick="screenfull" @click="$router.push('/index')">
    </div>

    <div class="right">
      <div class="search">
        <el-input v-model="searchWords" placeholder="输入关键词进行搜索，支持多词、分词模式" size="medium" @keyup.enter.native="search" clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>

      <div class="account-login">
        <el-popover v-if="$store.getters.accountIdentity" placement="bottom-end" trigger="hover" width="100">
          <div>
            <m-icon name="zhanghu"></m-icon>
            <el-button type="text" @click="personalCenter">账户管理</el-button>
          </div>
          <div v-if="$store.getters.accountIdentity == 'admin'">
            <m-icon name="jiaolian1-copy"></m-icon>
            <el-button type="text" @click="teacherManage">教师功能</el-button>
          </div>
          <div>
            <m-icon name="zhuxiao"></m-icon>
            <el-button type="text" @click="loginOut">退出账号</el-button>
          </div>

          <div slot="reference">
            <div class="logined">
              <img :src="$store.getters.avatar||'static/pic/avatar.png'" alt="">
              <div class="real-name">{{$store.getters.realName}}</div>
              <m-icon name="xsj"></m-icon>
            </div>
          </div>
        </el-popover>

        <div v-else class="login-entrance">
          <el-button type="text" class="login-button" @click="userLogin">登录</el-button>
        </div>
      </div>

      <div class="manual" @click="viewManual">
        <m-icon name="tiku"></m-icon>
        使用手册
      </div>
    </div>
  </div>
</template>

<script>
  import notify from '@/mixins/notify'
  import screenfull from 'screenfull'
  import api_exercise from '@/api/exercise'
  export default {
    mixins: [notify],
    data() {
      return {
        searchWords: '',
        timer: null,
        hasDbclick: false
      }
    },
    methods: {
      screenfull() {
        if (!screenfull.enabled) {
          console.log('you browser can not support screenfull');
          return false
        }
        screenfull.toggle()
      },
      search() {
        if (this.searchWords) {
          const firstIndex = this.$route.path.indexOf('/')
          const secondIndex = this.$route.path.indexOf('/', firstIndex + 1)
          const fatherRoute = this.$route.path.substring(1, secondIndex);
          const sonRoute = this.$route.path.substring(secondIndex + 1);
          if (fatherRoute == 'search') {
            this.$router.push({
              name: sonRoute,
              query: {
                word: this.searchWords
              }
            })
          } else {
            this.$router.push({
              name: 'content',
              query: {
                word: this.searchWords
              }
            })
          }
        } else {
          this.notify('请输入查询关键词', 'info');
        }
      },
      userLogin() {
        this.$store.commit('recordUrl', this.$route.path);
        this.$router.push('/login');
      },
      personalCenter() {
        this.$router.push({
          name: 'profile',
          params: {
            id: this.$store.getters.account
          }
        });
      },
      teacherManage() {
        let param = {
          user_name: this.$store.getters.account,
          password: this.$store.getters.password,
          user_type: this.$store.getters.accountIdentity
        }
        api_exercise.preAcademic(param);
        this.$router.push({
          name: 'questionBankManage',
          params: {
            id: this.$store.getters.account
          }
        });
      },
      loginOut() {
        if (window.localStorage.getItem('adminIdentity') || window.localStorage.getItem('studentIdentity')) {
          this.$confirm("您已登录，确定退出吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              closeOnClickModal: false
            })
            .then(() => {
              this.$store.commit('loginOut');
              this.notify('登出成功', 'success');
              this.$router.push('/index');
            })
            .catch(() => {
              this.notify('已取消', 'info');
            });
          return;
        }
      },
      viewManual() {
        // const {
        //   href
        // } = this.$router.resolve({
        //   name: 'manual'
        // })
        window.open('http://119.23.239.27:81', '_blank')
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/vars.scss';

  .header-container {
    @media only screen and (min-device-width: 1920px) {
      flex-basis: 60px;
    }
    box-sizing: border-box;
    flex-basis: 55px;
    flex-shrink: 0;
    align-items: center;
    overflow: hidden;
    color: $color-greyWhite; //文本顔色
    line-height: 1;
    background: $color-theme;
    border-bottom: 0.5px solid $color-dividingLine;
    display: flex;
    .logo {
      flex-shrink: 0;
      &>img {
        height: 50px;
        width: 190px;
        text-align: center;
        cursor: pointer;
      }
    }

    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .search {
        width: 400px;
        margin-right: 20px;
      }
      .account-login {
        margin-right: 10px;
        font-size: 1em;
        .login-entrance {
          display: flex;
          align-items: center;
          .login-button {
            color: $color-greyWhite;
            font-size: 1em;
            padding: 0 15px 0 10px;
            border-radius: 0;
            &:hover {
              color: $color-white;
            }
          }
        }
        .logined {
          flex-basis: 200px;
          margin-right: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            color: $color-white;
          }
          img {
            flex-shrink: 0;
            height: 2.3em;
            width: 2.3em;
            margin-right: 10px;
            border-radius: 50%;
          }
          .real-name {
            flex-shrink: 0;
            font-size: 1em;
          }
        }
      }
      .manual {
        flex-shrink: 0;
        font-size: 1em;
        margin-right: 15px;
        position: relative;
        top: -3px;
        cursor: pointer;
        &:hover {
          color: $color-white;
        }
        .icon {
          width: 1.2em;
          height: 1.2em;
          position: relative;
          top: 0.2em;
        }
      }
    }
  }
</style>

<style lang="scss">
  @import '~@/styles/vars.scss';
  .el-popover {
    color: $color-theme;
  }
</style>
