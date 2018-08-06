<template>
  <div ref="container" class="attended-discuss">
    <div v-if="questions.length">
      <discuss-Content :questions="questions" :loading="loading" :page="page" @switch-loading="switchLoading" @admin-delete-question="adminDeleteQuestion"></discuss-Content>

      <pagination :count="count" @turn-page="turnPage" @get-question-avatar="getQueAndAvatar"></pagination>
    </div>
    <div v-else class="no-attend">
      您还没有参与过讨论，点击上方的"最新讨论"去参与吧~
    </div>
  </div>
</template>

<script>
  import api_discuss from '@/api/discuss'
  import api_account from '@/api/account'
  import discussContent from '@/views/discuss/components/content'
  import pagination from '@/views/discuss/components/pagination'
  import {
    scrollTo
  } from '@/utils'
  export default {
    data() {
      return {
        questions: [],
        loading: false,
        page: 1,
        count: 0,
      }
    },
    mounted() {
      this.getQuestionPage()
      this.getQueAndAvatar()
    },
    methods: {
      scrollTo: scrollTo,
      goTop() {
        let top = this.$refs.container.scrollTop
        if (top > 0) {
          this.scrollTo(this.$refs.container)
        }
      },
      switchLoading(val) {
        this.loading = val;
      },
      adminDeleteQuestion(id) {
        this.$confirm("您确认删除该讨论吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false
          })
          .then(() => {
            let params = {
              option_type: 'delete_discuss',
              user_name: this.$store.getters.account,
              password: this.$store.getters.password,
              user_type: this.$store.getters.accountIdentity,
              discuss_id: id
            }
            api_discuss.adminDeleteQuestion(params)
              .then(data => {
                if (data == 'disallow') {
                  this.$notify({
                    message: '您无权限删除',
                    type: 'warning',
                    offset: 50
                  })
                } else {
                  this.getQueAndAvatar()
                    .then(data => {
                      if (data == 1) {
                        this.getQuestionPage()
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
          })
      },
      turnPage(val) {
        this.page = val;
        this.goTop()
      },
      getQuestionPage() {
        let params = {
          option_type: 'get_page_num',
          sort_type: 'user_comment',
          user_name: this.$store.getters.account
        }
        api_discuss.getQuestionPage(params).then(data => {
          this.count = parseInt(data);
        })
      },
      getQueAndAvatar() {
        return new Promise((resolve, reject) => {
          this.getAttendQuestion()
            .then(data => {
              if (data == 1) {
                this.getAllAvatar()
                resolve(1)
              }
            })
        })
      },
      getAttendQuestion() {
        return new Promise((resolve, reject) => {
          let params = {
            option_type: 'main',
            sort_type: 'user_comment',
            page: this.page,
            user_name: this.$store.getters.account
          }
          api_discuss.getAttendQuestion(params)
            .then(data => {
              const questionList = data;
              this.questions = [];
              this.questions.push(...questionList);
              for (const question of this.questions) {
                this.$set(question, 'readMore', false)
                this.$set(question, 'viewAnswer', false)
                this.$set(question, 'answerRequired', false)
                this.$set(question, 'avatar', '')
              }
              resolve(1)
            })
            .catch(error => {
              console.log(error);
              reject(error)
            })
        })
      },
      getAllAvatar() {
        return new Promise((resolve, reject) => {
          for (const [index, question] of this.questions.entries()) {
            this.getAvatar(question.sponsor, index)
          }
          resolve(1)
        })
      },
      getAvatar(name, index) {
        let param = {
          user_name: name,
          option_type: 'profile_picture',
        }
        api_account.getAvatar(param)
          .then(avatarUrl => {
            this.questions[index].avatar = avatarUrl;
          })
      }
    },
    components: {
      discussContent,
      pagination
    }
  }
</script>

<style lang="scss" scoped>
  .attended-discuss {
    height: 100%;
    overflow: auto;
    .no-attend {
      width: 800px;
      margin: 0 auto;
      padding-top: 20px;
    }
  }
</style>
