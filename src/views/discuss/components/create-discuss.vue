<template>
  <div class="create-discuss">
    <div class="suspended-balls">
      <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus()" type="primary" icon="el-icon-star-on"></el-button>
      <div class="suspended-ball" :class="{'question-ball':ballsStatus}" @click="setQuestionFormVisible">
        <span>发起讨论</span>
      </div>
    </div>

    <el-dialog title="写下你的讨论信息" :visible.sync="questionFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="questionForm" ref="questionForm" :rules="questionFormRules" label-position="top" label-width="75px">
        <el-form-item prop="title" label="标题：请控制在60字内">
          <el-input v-model="questionForm.title">
          </el-input>
        </el-form-item>
        <el-form-item prop="description" label="讨论描述：请详细说明该讨论的具体信息，以获得更有帮助的答案，字数控制在300字内">
          <el-input v-model="questionForm.description" type="textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createQuestion">发起讨论</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from '@/mixins/mixin'
  import account from '@/mixins/account'
  import api_discuss from '@/api/discuss'

  export default {
    mixins: [mixin, account],
    data() {
      return {
        questionFormVisible: false,
        questionForm: {
          title: '',
          description: ''
        },
        questionFormRules: {
          title: [{
            required: true,
            message: '标题不能为空'
          }, {
            max: 60,
            message: '字数限制在60之内'
          }],
          description: [{
            required: true,
            message: '描述不能为空'
          }, {
            max: 300,
            message: '请将字数限制在300之内'
          }],
        }
      }
    },
    methods: {
      setQuestionFormVisible() {
        if (this.$store.getters.accountIdentity) {
          this.questionFormVisible = true
        } else {
          this.notLogged("登录后才可发起讨论，确定跳转到登录页面吗？");
        }
      },
      createQuestion() {
        this.$refs.questionForm.validate(vaild => {
          if (vaild) {
            let params = {
              option_type: 'create_discuss',
              user_name: this.$store.getters.account,
              password: this.$store.getters.password,
              user_type: this.$store.getters.accountIdentity,
              title: this.questionForm.title,
              text: this.questionForm.description
            }
            api_discuss.createQuestion(params).then(data => {
              if (data == 'disallow') {
                this.accountExpire();
              } else if (data.sponsor) {
                this.questionFormVisible = false;
                this.$emit('update-question-list');
              }
            })
          }
        })
      },
    }
  }
</script>

<style lang="postcss" scoped>
  @import '../../../styles/vars.css';
  .create-discuss {
    &>.suspended-balls {
      & :nth-child(1) {
        z-index: 2;
      }
      & .collapsed-ball {
        opacity: 1;
      }
      & .question-ball {
        transform: translateY(-4.5em);
      }
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .create-discuss {
    .el-form-item__label {
      color: #000;
      font-size: 1em;
    }
    .el-form-item__error {
      color: $color-theme;
    }
    .el-dialog {
      width: 650px;
      margin: -0 auto;
      .el-dialog__header,
      .el-dialog__footer {
        text-align: center;
      }
      .el-dialog__header {
        .el-dialog__headerbtn {
          right: -40px;
          top: 10px;
          font-size: 2em;
          .el-dialog__close {
            color: #fff;
          }
        }
      }
      .el-textarea__inner {
        height: 150px;
      }
    }
  }
</style>
