<template>
  <div class="content" v-loading="loading">
    <div v-for="(question, questionIndex) in questions" :key="questionIndex" class="question">
      <!-- 提问者信息 -->
      <div class="question-top">
        <div class="left">
          <img class="avatar" :src="question.avatar" alt="">
          <div class="text-info">
            <div class="nickname">
              <el-tooltip class="item" effect="light" :content="`${question.sponsor}`" placement="top">
                <span>{{question.sponsor_real_name}}</span>
              </el-tooltip>
            </div>
            <div class="time">发表于{{question.start_time}}</div>
          </div>
        </div>
        <m-icon v-if="$store.getters.accountIdentity == 'admin' || $store.getters.account == question.sponsor" name="cha" @click="$emit('admin-delete-question', question.discuss_id)"></m-icon>
      </div>

      <div class="title" v-html="question.title">
      </div>

      <!-- 提问内容 -->
      <div class="text">
        <div v-if="question.first_comment.length > 150">
          {{`${question.first_comment.substring(0, 60)}`}}
          <span v-if="question.readMore">{{question.first_comment.substring(60)}}</span>
          <span v-else class="read-more" @click="question.readMore = true">... 更多</span>
        </div>
        <div v-else>
          {{question.first_comment}}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="question-bottom">
        <div class="operations">
          <m-button class="view-answer" @click="viewAnswer(question, questionIndex)">
            <m-icon name="huida2"></m-icon>
            <span>{{question.viewAnswer ? '收起回答' : question.num_comment > 0 ? `${question.num_comment} 条回答` : '暂无回答'}}</span>
          </m-button>

          <m-button class="write-answer" @click="setAnswerFormVisible(question, questionIndex)">
            <m-icon name="huida"></m-icon>
            <span>写回答</span>
          </m-button>

          <el-popover placement="bottom" trigger="click" width="110">
            <div>
              <m-icon name="lianjie"></m-icon>
              <el-button type="text" @click="copyLink(question, $event)">复制链接</el-button>
            </div>
            <div>
              <m-icon name="qq"></m-icon>
              <el-button type="text" @click="shareToQQ(question)">分享至QQ</el-button>
            </div>
            <div slot="reference">
              <m-button class="share">
                <m-icon name="fenxiang"></m-icon>分享
              </m-button>
            </div>
          </el-popover>
        </div>

        <m-button class="collapse" v-if="question.readMore" @click="question.readMore = false">
          收起
          <m-icon name="xiangshangjiantou"></m-icon>
        </m-button>
      </div>

      <!-- 回答模块 -->
      <div v-show="question.viewAnswer" class="answers">
        <m-loading v-if="!question.answerRequired"></m-loading>
        <div v-else>
          <div v-if="!parseInt(question.num_comment)" class="no-answer">目前暂无人回答，点击写回答您可回答该问题</div>
          <div v-else>
            <div class="title">{{question.num_comment}} 条回答</div>
            <div v-for="(answer, answerIndex) in answers[questionIndex]" :key="answerIndex" class="answer">
              <!-- 回答者信息 -->
              <div class="responder-info">
                <div class="left">
                  <img class="avatar" :src="answer.avatar" alt="">
                  <div class="text-info">
                    <div class="nickname">
                      <el-tooltip class="item" effect="light" :content="`${answer.send_user}`" placement="top">
                        <span>{{answer.send_user_real_name}}</span>
                      </el-tooltip>
                    </div>
                    <div class="time">回答于{{answer.comment_time}}</div>
                  </div>
                </div>
              </div>

              <!-- 回答内容 -->
              <div class="text">
                <div v-if="answer.text.length > 150">
                  {{`${answer.text.substring(0, 60)}`}}
                  <span v-if="answer.readMore">{{answer.text.substring(60)}}</span>
                  <span v-else class="read-more" @click="answer.readMore = true">... 更多</span>
                </div>
                <div v-else>
                  {{answer.text}}
                </div>
              </div>

              <div v-if="!answer.showCommentInput" class="answer-bottom">
                <div class="operations">
                  <m-button @click="answer.showCommentInput = true;replyOther(answer.send_user_real_name)">
                    <m-icon name="huifu"></m-icon>
                    <span>回复</span>
                  </m-button>
                  <m-button v-if="$store.getters.accountIdentity == 'admin' || $store.getters.account == answer.send_user" @click="adminDeleteAnswer(answer.comment_id)">
                    <m-icon name="shanchu"></m-icon>
                    <span>删除</span>
                  </m-button>
                </div>

                <m-button class="collapse" v-show="answer.readMore" @click="answer.readMore = false">
                  收起
                  <m-icon name="xiangshangjiantou"></m-icon>
                </m-button>
              </div>

              <!-- 回复他人 -->
              <div v-else class="reply-other">
                <el-input class="input-box" v-model="commentText" :placeholder="replyPlaceholder" maxlength="200">
                </el-input>
                <div class="buttons">
                  <el-button type="text" size="medium" @click="answer.showCommentInput = false">取消</el-button>
                  <el-button type="primary" size="medium" :disabled="!commentText" @click="confirmReply">评论</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 回答别人 -->
    <el-dialog title="写下你的回答" :visible.sync="answerFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="answerForm" ref="answerForm" :rules="answerFormRules" label-position="top" label-width="75px">
        <el-form-item prop="question" label="问题">
          <div class="toAnswering-question">{{answerForm.question}}</div>
        </el-form-item>
        <el-form-item prop="answer" label="请写下你的回答，字数控制在300字内">
          <el-input v-model="answerForm.answer" type="textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAnswer">提交回答</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api_discuss from '@/api/discuss'
  import account from '@/mixins/account'
  import mixin from '@/mixins/mixin'
  import clip from '@/utils/clipboard'
  import api_account from '@/api/account'
  export default {
    mixins: [account, mixin],
    props: {
      questions: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: false
      },
      page: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        answers: [],
        replyPlaceholder: '',
        commentText: '',
        answerFormVisible: false,
        answerForm: {
          question: '',
          answer: ''
        },
        answerFormRules: {
          answer: [{
            required: true,
            message: '回答不能为空'
          }, {
            max: 300,
            message: '请将字数限制在300之内'
          }],
        },
        toAnsweredQuestion: '',
        toAnsweredQuestionIndex: ''
      }
    },
    methods: {
      viewAnswer(question, index) {
        this.toAnsweredQuestion = question;
        this.toAnsweredQuestionIndex = index;
        question.viewAnswer = !question.viewAnswer
        if (question.viewAnswer) {
          this.getAnswerList(question, index)
            .then(data => {
              if (data == 1) {
                this.getAllAvatar(index)
              }
            })
        } else {
          question.answerRequired = false
        }
      },
      getAllAvatar(index) {
        return new Promise((resolve, reject) => {
          for (const key in this.answers[index]) {
            this.getAvatar(this.answers[index][key].send_user, key, index)
          }
          resolve(1)
        })
      },
      getAvatar(name, index, answerIndex) {
        let param = {
          user_name: name,
          option_type: 'profile_picture',
        }
        api_account.getAvatar(param)
          .then(avatarUrl => {
            this.answers[answerIndex][index].avatar = avatarUrl;
          })
      },
      getAnswerList(question, index) {
        return new Promise((resolve, reject) => {
          let params = {
            option_type: 'accurate',
            discuss_id: question.discuss_id
          }
          api_discuss.getAnswerList(params)
            .then(data => {
              const discuss = data;
              const answerList = discuss.comment_list.slice(1);
              this.$set(this.answers, index, answerList)
              for (const answer of this.answers[index]) {
                this.$set(answer, 'readMore', false)
                this.$set(answer, 'showCommentInput', false)
                this.$set(answer, 'avatar', '')
              }
              question.answerRequired = true
              resolve(1)
            })
            .catch(error => {
              console.log(error);
              reject(error)
            })
        })
      },
      setAnswerFormVisible(question, questionIndex) {
        if (this.$store.getters.accountIdentity) {
          this.toAnsweredQuestion = question;
          this.toAnsweredQuestionIndex = questionIndex;
          this.answerFormVisible = true;
          this.answerForm.answer = ''
          this.answerForm.question = question.first_comment
        } else {
          this.notLogged("登录后才可回答，确定跳转到登录页面吗？");
        }
      },
      copyLink(question, event) {
        let link = `http://www.pingyaogucheng.com.cn/#/discuss/${question.discuss_id}`
        clip(link, event);
      },
      shareToQQ(question) {
        let p = {
          url: `http://www.pingyaogucheng.com.cn/#/discuss/${question.discuss_id}`,
          /*获取URL，可加上来自分享到QQ标识，方便统计*/
          desc: '计算机操作系统教学辅助软件',
          /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
          title: '学习讨论',
          /*分享标题(可选)*/
          summary: question.first_comment,
          /*分享摘要(可选)*/
          // pics: '',
          /*分享图片(可选)*/
          style: '201',
          width: 32,
          height: 32
        }
        let s = []
        for (let i in p) {
          s.push(i + '=' + encodeURIComponent(p[i] || ''))
        }
        window.open(`http://connect.qq.com/widget/shareqq/index.html?${s.join('&')}`)
      },
      confirmAnswer() {
        this.$refs.answerForm.validate(valid => {
          if (valid) {
            let params = {
              option_type: 'insert_comment',
              discuss_id: this.toAnsweredQuestion.discuss_id,
              text: this.answerForm.answer,
              user_name: this.$store.getters.account,
              password: this.$store.getters.password,
              user_type: this.$store.getters.accountIdentity
            }
            api_discuss.writeAnswer(params)
              .then(data => {
                if (data == 'disallow') {
                  this.accountExpire();
                } else {
                  this.answerFormVisible = false;
                  this.$emit('switch-loading', true);
                  this.getAnswerList(this.toAnsweredQuestion, this.toAnsweredQuestionIndex)
                    .then(data => {
                      if (data) {
                        this.getAllAvatar(this.toAnsweredQuestionIndex)
                          .then(data => {
                            if (data == 1) {
                              this.questions[this.toAnsweredQuestionIndex].num_comment = parseInt(this.questions[
                                this
                                .toAnsweredQuestionIndex].num_comment) + 1;
                              this.$emit('switch-loading', false);
                              this.$notify({
                                title: '成功',
                                message: '回答成功',
                                type: 'success',
                                offset: 50
                              })
                            }
                          })
                      }
                    })
                }
              })
          }
        })
      },
      replyOther(name) {
        this.commentText = ''
        this.replyPlaceholder = `回复${name}:`;
      },
      adminDeleteAnswer(id) {
        this.$confirm("您确认删除该评论吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false
          })
          .then(() => {
            let params = {
              option_type: 'delete_comment',
              user_name: this.$store.getters.account,
              password: this.$store.getters.password,
              user_type: this.$store.getters.accountIdentity,
              comment_id: id
            }
            api_discuss.adminDeleteAnswer(params)
              .then(data => {
                if (data == 'disallow') {
                  this.$notify({
                    message: '您无权限删除',
                    type: 'warning',
                    offset: 50
                  })
                } else {
                  this.getAnswerList(this.toAnsweredQuestion, this.toAnsweredQuestionIndex)
                    .then(data => {
                      if (data) {
                        this.getAllAvatar(this.toAnsweredQuestionIndex)
                          .then(data => {
                            if (data == 1) {
                              this.questions[this.toAnsweredQuestionIndex].num_comment = parseInt(this.questions[
                                  this.toAnsweredQuestionIndex]
                                .num_comment) - 1;
                              this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success',
                                offset: 50
                              })
                            }
                          })
                      }
                    })
                }
              })
          })
      },
      confirmReply() {
        if (this.$store.getters.accountIdentity) {
          let params = {
            option_type: 'insert_comment',
            discuss_id: this.toAnsweredQuestion.discuss_id,
            text: this.replyPlaceholder + this.commentText,
            user_name: this.$store.getters.account,
            password: this.$store.getters.password,
            user_type: this.$store.getters.accountIdentity
          }
          api_discuss.writeAnswer(params)
            .then(data => {
              if (data == 'disallow') {
                this.accountExpire();
              } else {
                this.getAnswerList(this.toAnsweredQuestion, this.toAnsweredQuestionIndex)
                  .then(data => {
                    if (data) {
                      this.getAllAvatar(this.toAnsweredQuestionIndex)
                        .then(data => {
                          if (data == 1) {
                            this.questions[this.toAnsweredQuestionIndex].num_comment = parseInt(this.questions[
                                this.toAnsweredQuestionIndex]
                              .num_comment) + 1;
                            this.$notify({
                              title: '成功',
                              message: '回复成功',
                              type: 'success',
                              offset: 50
                            })
                          }
                        })
                    }
                  })
              }
            })
        } else {
          this.notLogged("登录后才可进行评论，确定跳转到登录页面吗？");
        }
      }
    }
  }
</script>

<style lang="postcss" scoped>
  @import '../../../styles/vars.css';
  .content {
    width: 800px;
    margin: 0 auto;
    padding: 20px 20px 0;
    &>.question {
      margin-bottom: 15px;
      padding: 15px 20px;
      background-color: var(--color-white);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      & :matches(.question-top, .responder-info) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &>.left {
          display: flex;
          &>.avatar {
            height: 3em;
            width: 3em;
            border-radius: 50%;
            cursor: pointer;
          }
          &>.text-info {
            margin-left: 10px;
            &>.nickname {
              font-size: 1.1em;
            }
            &>.time {
              font-size: 0.9em;
              color: var(--color-lightGrey);
            }
          }
        }
        &>.icon {
          color: var(--color-lightGrey);
          cursor: pointer;
        }
      }
      &>.title {
        margin-top: 10px;
        font-size: 1.2em;
      }
      & .text {
        font-size: 1em;
        line-height: 1.8em;
        margin-top: 10px;
        color: var(--color-lightGrey);
        & .read-more {
          font-size: 1.1em;
          color: var(--color-blue);
          cursor: pointer;
        }
        & .stress {
          color: var(--color-darkBlue);
        }
      }
      & :matches(.question-bottom, .answer-bottom) {
        &>.operations {
          margin-top: 8px;
          display: flex;
        }
        & .button {
          width: 75px;
          &:not(:last-child) {
            margin-right: 8px;
          }
          &>.icon {
            width: 1.4em;
            height: 1.4em;
          }
          &:hover {
            color: var(--color-blue);
          }
        }
      }
      & :matches(.question-bottom, .answer-bottom) {
        display: flex;
        justify-content: space-between;
      }
      &>.question-bottom {
        &>.operations {
          & .view-answer {
            width: 115px;
          }
          & .write-answer {
            width: 100px;
          }
          & .share {
            width: 85px;
          }
        }
        &>.collapse {
          color: var(--color-blue);
        }
      }
      &>.answers {
        margin-top: 15px;
        padding: 25px;
        border: 1px solid #ebebeb;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
        & .no-answer {
          font-size: 1em;
          padding-left: 6px;
          color: var(--color-lightGrey);
        }
        & .title {
          font-size: 1.3em;
          padding-left: 6px;
          color: var(--color-lightGrey);
        }
        & .answer {
          margin-top: 20px;
          &:not(:last-child) {
            padding-bottom: 15px;
            border-bottom: 0.5px solid color(var(--color-lightGrey) a(0.8));
          }
          &>.answer-bottom {
            & .collapse {
              color: var(--color-blue);
            }
          }
          &>.reply-other {
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            &>.buttons {
              margin-top: 15px;
              display: flex;
              justify-content: flex-end;
            }
          }
        }
      }
    }
    & .toAnswering-question {
      padding-left: 10px;
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .content {
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
