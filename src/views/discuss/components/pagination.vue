<template>
  <div class="pagination">
    <el-pagination @current-change="turnPage" current-page.sync="1" :page-size="10" layout="prev, pager, next, jumper" :page-count="count">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    props: {
      count: {
        type: Number,
        default: 0
      }
    },
    methods: {
      turnPage(val) {
        this.$emit('turn-page', val);
        this.$emit('get-question-avatar')
      }
    }
  }
</script>

<style lang="postcss" scoped>
  @import '../../../styles/vars.css';
  .pagination {
    width: 800px;
    margin: 0 auto 15px;
    background-color: var(--color-white);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    padding: 12px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
