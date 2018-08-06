<template>
	<div class="home">
		<div v-for="item in systemIntroduction" :key="item.index" class="introduction">
			<h2 v-html="item.title"></h2>
			<p v-html="`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.text}`" class="introduction-content"></p>
		</div>
	</div>
</template>

<script>
	import {systemIntroduction} from '@/assets/textData/systemIntroduction'

	export default {
		data() {
			return {
				systemIntroduction: []
			}
		},
		mounted() {
      this.$notify.closeAll()
			this.systemIntroduction = systemIntroduction;
		}
	}

</script>

<style lang="scss" scoped>
	@import '~@/styles/vars.scss';
	.home {
		height: 100%;
		width: 100%;
		overflow: auto;
		box-sizing: border-box;
		padding: 20px;
		display: flex;
		align-items: center;
		.introduction {
			flex-shrink: 0;
			width: 900px;
			border: 1.2px solid $color-theme;
			background-color: $color-navbg;
			border-radius: 20px;
			padding: 0 20px;
			margin: auto;
			.introduction-content {
				line-height: 1.8;
				font-size: 1.1em;
			}
		}
	}

</style>
