<template>
  <div class="search-discuss" ref="container" v-loading="dataLoading">
    <div v-if="!dataLoading && !questions.length" class="no-result">未查询到任何内容，换个关键词试试吧</div>
    <discuss-Content v-else :questions="questions" :loading="loading" :page="page" @switch-loading="switchLoading"></discuss-Content>

    <!-- 翻页 -->
    <pagination v-if="questions.length" :count="count" @turn-page="turnPage" @get-question-avatar="getQueAndAvatar"></pagination>
  </div>
</template>

<script>
  import api_discuss from '@/api/discuss'
  import api_account from '@/api/account'
  import mixin from '@/mixins/mixin'
  import api_search from '@/api/search'
  import notify from '@/mixins/notify'
  import discussContent from '@/views/discuss/components/content'
  import pagination from '@/views/discuss/components/pagination'
  import {
    scrollTo
  } from '@/utils'
  export default {
    mixins: [notify],
    data() {
      return {
        dataLoading: true,
        loading: false,
        questions: [],
        page: 1,
        count: 0
      }
    },
    mounted() {
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
      getUnion(a, b) {
        for (let [index, item] of b.entries()) {
          if (a[index + 1] !== undefined && item > a[index + 1]) {
            const min = Math.min(item, a[index], a[index + 1], b[index + 1])
            const max = Math.max(item, a[index], a[index + 1], b[index + 1])
            a.splice(index, 2, min)
            b.splice(index, 2, max)
          }
        }
        if (isEnd(a, b) === false) {
          this.getUnion(a, b)
        }

        function isEnd(a, b) {
          for (const [index, item] of b.entries()) {
            if (a[index + 1] !== undefined) {
              if (item > a[index + 1]) {
                return false
              }
            }
          }
          return true;
        }
      },
      getDataAndColor() {
        return new Promise((resolve, reject) => {
          let params = {
            key_word: this.$route.query.word,
            option_type: 'discuss',
            page: this.page
          }
          api_search.search(params).then(search => {
            this.questions = []
            this.count = parseInt(search[0]["comment_imf"]);
            const searchWords = search[0]["key_word_list"].slice();
            for (let i = 1; i < search.length; i++) {
              this.questions.push(search[i])
            }
            const searchResult = this.questions;
            for (const question of this.questions) {
              this.$set(question, 'readMore', false)
              this.$set(question, 'viewAnswer', false)
              this.$set(question, 'answerRequired', false)
              this.$set(question, 'avatar', '')
            }
            let indexStart = []
            let indexEnd = []

            function getItemIndex(text, word, from) {
              if (text.indexOf(word, from) > -1) {
                indexStart.push(text.indexOf(word, from))
                indexEnd.push(text.indexOf(word, from) + word.length)
                getItemIndex(text, word, text.indexOf(word, from) + 1)
              }
            }

            String.prototype.splice = function (start, newStr) {
              return this.slice(0, start) + newStr + this.slice(start);
            };

            function sortUp(a, b) {
              return a - b
            }

            for (const item of searchResult.keys()) {
              indexStart = [];
              indexEnd = [];
              for (const word of searchWords) {
                getItemIndex(searchResult[item]["title"], word, 0)
              }
              this.getUnion(indexStart.sort(sortUp), indexEnd.sort(sortUp))

              for (let i = indexStart.length - 1; i >= 0; i--) {
                searchResult[item]["title"] = searchResult[item]["title"].splice(indexEnd[i], '</span>')
                searchResult[item]["title"] = searchResult[item]["title"].splice(indexStart[i],
                  '<span style="color:#FF8D00; font-weight: 600">')
              }
            }
            resolve(1)
          }).catch(error => {
            this.notify('网络不稳定，请您稍后重试', 'error');
            reject(error)
          })
        })
      },
      getQueAndAvatar() {
        this.getDataAndColor()
          .then(data => {
            if (data == 1) {
              this.dataLoading = false;
              this.getAllAvatar()
              this.goTop()
            }
          })
      },
      getAllAvatar() {
        for (const [index, question] of this.questions.entries()) {
          this.getAvatar(question.sponsor, index)
        }
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
      },
      switchLoading(val) {
        this.loading = val;
      },
      turnPage(val) {
        this.page = val;
      }
    },
    watch: {
      '$route.query.word': function () {
        this.getQueAndAvatar();
      }
    },
    components: {
      discussContent,
      pagination
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .search-discuss {
    height: 100%;
    width: 840px;
    margin: 0 auto;
    .no-result {
      margin: 0 auto;
    }
  }
</style>
