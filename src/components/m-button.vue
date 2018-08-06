<template>
  <button class="button" @click="$emit('click')">
    <template v-if="$slots.default">
      <slot></slot>
    </template>
  </button>
</template>

<script>
  export default {
    name: 'm-button'
  }

</script>

<style lang="postcss">
  @import '../styles/vars.css';
  .button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 1em;
    padding: 5px;
    border: none;
    color: var(--color-lightGrey);
    background-color: var(--color-white);
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }

</style>
