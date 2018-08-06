<template>
  <div class="sign-container">
    <div class="sign-content">
      <div class="logo">
        <img src="static/pic/logo-reverse.png" alt="">
      </div>
      <div class="sign-innner">
        <el-form class="loginForm" ref="loginForm" :model="loginForm" :rules="loginFormnRule">
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="accountIdentity">
            <el-radio v-model="loginForm.accountIdentity" label="student">学生</el-radio>
            <el-radio v-model="loginForm.accountIdentity" label="admin">教师</el-radio>
          </el-form-item>
          <div>
            <el-button class="submit" type="primary" :loading="logining" @click="login">登录</el-button>
          </div>
        </el-form>
        <!-- <div class="sign-switch">
          没有账号？
          <el-button type="text" class="signUp-button">注册</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import api_account from '@/api/account'
  import notify from '@/mixins/notify'
  export default {
    mixins: [notify],
    data() {
      return {
        logining: false,
        loginForm: {
          account: '',
          password: '',
          accountIdentity: 'student'
        },
        loginFormnRule: {
          account: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      this.$notify.closeAll()
    },
    methods: {
      login() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.logining = true
            let loginObj = {
              user_name: this.loginForm.account,
              password: this.loginForm.password,
              user_type: this.loginForm.accountIdentity
            };
            api_account.login(loginObj).then(data => {
              if (data !== 'disallow') {
                this.logining = false
                this.$store.commit('loginIn', {
                  accountIdentity: this.loginForm.accountIdentity,
                  account: this.loginForm.account,
                  password: this.loginForm.password
                });
                this.$store.commit('setName', data);
                this.notify('登录成功', 'success');
                this.$router.push('/index');
              } else {
                this.$notify.closeAll()
                this.notify('用户名或密码错误', 'error');
                this.logining = false
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="postcss" scoped>
  @import '../../styles/vars.css';
  .sign-container {
    height: 100vh;
    min-height: 700px;
    display: flex;
    flex-direction: column;
    background-color: var(--color-darkWhite);
    &>.sign-content {
      margin: auto;
      background-color: #fff;
      box-shadow: 0 0 25px var(--color-shadow);
      border: 1px solid var(--color-lightBlue);
      border-radius: 5px;
      width: 450px;
      &>.logo {
        text-align: center;
        font-size: 1.5em;
        margin-top: 25px;
        color: var(--color-theme);
      }
      &>.sign-innner {
        &>.loginForm {
          padding: 25px 55px 35px;
          &>:nth-last-child(2) {
            margin-bottom: 15px;
          }
          & .submit {
            width: 100%;
            font-size: 1.4em;
            letter-spacing: 8px;
            border-radius: 100px;
          }
        }
        &>.sign-switch {
          text-align: center;
          padding: 12px 0;
          background-color: var(--color-darkWhite);
          &>.signUp-button {
            font-size: 1.1em;
          }
        }
      }
    }

  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .sign-container {
    .el-form-item__error {
      color: $color-theme;
    }
  }
</style>
