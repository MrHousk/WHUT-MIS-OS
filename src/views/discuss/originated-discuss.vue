<template>
  <div ref="container" class="originated-discuss">
    <div v-if="questions.length">
      <discuss-Content :questions="questions" :loading="loading" :page="page" @switch-loading="switchLoading" @admin-delete-question="adminDeleteQuestion"></discuss-Content>

      <pagination v-if="questions.length" :count="count" @turn-page="turnPage" @get-question-avatar="getQueAndAvatar"></pagination>
    </div>
    <div v-else class="no-attend">
      您还没有发起过讨论，点击右下角的"发起讨论"去发起吧~
    </div>

    <!-- 发起讨论 -->
    <create-discuss @update-question-list="updateQuesitonList"></create-discuss>
  </div>
</template>

<script>
  import api_discuss from '@/api/discuss'
  import api_account from '@/api/account'
  import discussContent from '@/views/discuss/components/content'
  import pagination from '@/views/discuss/components/pagination'
  import createDiscuss from '@/views/discuss/components/create-discuss'
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
          sort_type: 'user_discuss',
          user_name: this.$store.getters.account
        }
        api_discuss.getQuestionPage(params).then(data => {
          this.count = parseInt(data);
        })
      },
      getQueAndAvatar() {
        return new Promise((resolve, reject) => {
          this.getMyQuestion()
            .then(data => {
              if (data == 1) {
                this.getAvatar()
                resolve(1)
              }
            })
        })
      },
      getAvatar(name, index) {
        return new Promise((resolve, reject) => {
          let param = {
            user_name: this.$store.getters.account,
            option_type: 'profile_picture',
          }
          api_account.getAvatar(param)
            .then(avatarUrl => {
              for (const [index, question] of this.questions.entries()) {
                this.questions[index].avatar = avatarUrl;
              }
              resolve(1)
            })
        })
      },
      getMyQuestion() {
        return new Promise((resolve, reject) => {
          let params = {
            option_type: 'main',
            sort_type: 'user_discuss',
            page: this.page,
            user_name: this.$store.getters.account
          }
          api_discuss.getMyQuestion(params)
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
      updateQuesitonList() {
        this.loading = true;
        this.getMyQuestion()
          .then(data => {
            if (data == 1) {
              this.getAvatar()
              .then(data => {
                if (data == 1) {
                  this.loading = false;
                  this.goTop();
                  this.getQuestionPage();
                  this.$notify({
                    title: '成功',
                    message: '讨论发起成功',
                    type: 'success',
                    offset: 50
                  })
                }
              })
            }
          })
      },
    },
    components: {
      discussContent,
      pagination,
      createDiscuss
    }
  }
</script>

<style lang="scss" scoped>
  .originated-discuss {
    height: 100%;
    overflow: auto;
    .no-attend {
      width: 800px;
      margin: 0 auto;
      padding-top: 20px;
    }
  }
</style>
