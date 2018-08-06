<template>
  <div class="single-discuss">
    <discuss-Content :questions="questions" :loading="loading" @switch-loading="switchLoading"
      @turn-page="turnPage"></discuss-Content>
  </div>
</template>

<script>
  import discussContent from '@/views/discuss/components/content'
  import api_discuss from '@/api/discuss'
  import api_account from '@/api/account'
  export default {
    data() {
      return {
        questions: [],
        loading: false,
      }
    },
    mounted() {
      this.getQueAndAvatar()
    },
    methods: {
      getSingleQuestion() {
        return new Promise((resolve, reject) => {
          let params = {
            option_type: 'accurate',
            discuss_id: this.$route.params.id
          }
          api_discuss.getAnswerList(params)
            .then(data => {
              const discuss = data;
              let question = {
                discuss_id: discuss.discuss_id,
                sponsor: discuss.sponsor,
                sponsor_real_name: discuss.sponsor_real_name,
                start_time: discuss.start_time,
                title: discuss.title,
                first_comment: discuss["comment_list"][0].text,
                num_comment: discuss["comment_list"].length - 1,
                readMore: false,
                viewAnswer: false,
                answerRequired: false,
                avatar: ''
              }
              this.questions.push(question);
              resolve(1)
            })
            .catch(error => {
              console.log(error);
              reject(error)
            })
        })
      },
      getQueAndAvatar() {
        this.getSingleQuestion()
          .then(data => {
            if (data == 1) {
              this.getAvatar()
            }
          })
      },
      getAvatar() {
        let param = {
          user_name: this.questions[0].sponsor,
          option_type: 'profile_picture',
        }
        api_account.getAvatar(param)
          .then(avatarUrl => {
            this.questions[0].avatar = avatarUrl;
          })
      },
      switchLoading() {
        this.loading = val;
      },
      turnPage() {
        this.page = val;
      }
    },
    components: {
      discussContent
    }
  }
</script>

<style lang="postcss">
  .single-discuss {
    height: 100%;
    box-sizing: border-box;
    padding-top: 20px;
    overflow: auto;
  }
</style>
