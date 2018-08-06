<template>
  <div class="search-content" v-loading="loading">
    <div v-if="!loading && !searchTitle.length" class="no-result">未查询到任何内容，换个关键词试试吧</div>
    <transition-group v-else tag="div">
      <div v-for="(item,index) in searchTitle.length" :key="item" class="search-result-item">
        <router-link :to="searchLink[index]" class="search-title">
          <span v-html="`${index + 1} ${searchTitle[index]}`"></span>
        </router-link>
        <p v-html="searchText[index]"></p>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import api_search from '@/api/search'
  import notify from '@/mixins/notify'
  import {
    uniqueArray
  } from '@/utils'
  export default {
    mixins: [notify],
    data() {
      return {
        loading: true,
        searchText: [],
        searchTitle: [],
        searchLink: []
      }
    },
    methods: {
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
            option_type: 'content'
          }
          api_search.search(params)
            .then(search => {
              const searchWords = search.key_word_list.slice();
              const searchResult = search.result_list.slice();
              let indexStart = []
              let indexEnd = []
              //递归求得所查找子串的所有index(因子串长度不定，分开始和结束)
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
              this.searchText = []
              this.searchTitle = []
              this.searchLink = []
              for (const item of searchResult.keys()) {
                this.searchText[item] = searchResult[item][0];
                this.searchTitle[item] = searchResult[item][1];
                this.searchLink[item] = searchResult[item][2];

                indexStart = [];
                indexEnd = [];
                //将所有搜索词的索引推入一个数组后排序，再倒着加内联样式，可以避免依次加所带来的无法搜索样式内字符的bug
                for (const word of searchWords) {
                  getItemIndex(this.searchTitle[item], word, 0)
                }
                this.getUnion(indexStart.sort(sortUp), indexEnd.sort(sortUp))

                for (let i = indexStart.length - 1; i >= 0; i--) {
                  this.searchTitle[item] = this.searchTitle[item].splice(indexEnd[i], '</span>')
                  this.searchTitle[item] = this.searchTitle[item].splice(indexStart[i],
                    '<span style="color:#FF8D00;">')
                }

                indexStart = [];
                indexEnd = [];
                for (const word of searchWords) {
                  getItemIndex(this.searchText[item], word, 0)
                }
                this.getUnion(indexStart.sort(sortUp), indexEnd.sort(sortUp))

                for (let i = indexStart.length - 1; i >= 0; i--) {
                  this.searchText[item] = this.searchText[item].splice(indexEnd[i], '</span>')
                  this.searchText[item] = this.searchText[item].splice(indexStart[i],
                    '<span style="color:#FF8D00; font-weight: 600">')
                }
              }
              resolve(1)
            })
            .catch(error => {
              reject(error)
              this.notify('网络不稳定，请您稍后重试', 'error');
            })
        })
      }
    },
    watch: {
      '$route.query.word': function () {
        this.getDataAndColor();
      }
    },
    mounted() {
      this.getDataAndColor()
        .then(data => {
          if (data === 1) {
            this.loading = false;
          }
        })
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .search-content {
    height: 100%;
    width: 800px;
    margin: 0 auto;
    .no-result {
      width: 100%;
      margin: 0 auto;
    }
    .search-result-item {
      margin: 15px auto;
      background-color: #F0F0F0;
      border: 1px solid $color-dividingLine;
      border-radius: 5px;
      padding: 10px 20px 0;
      .search-title {
        color: $color-theme;
        font-weight: 550;
        margin-top: 10px;
        text-decoration: none;
        border-bottom: 1px solid $color-theme;
        >span {
          font-size: 1.2em;
        }
      }
    }
  }
</style>
