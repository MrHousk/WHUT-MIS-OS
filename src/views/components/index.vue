<template>
	<div class="index">
		<index-header></index-header>
		<div class="main">
			<nav-menu class="aside"></nav-menu>
			<div class="right">
				<transition mode="out-in" name="bounceDown">
					<router-view></router-view>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import indexHeader from './header'
	import navMenu from './nav-menu'

	export default {
		components: {
			indexHeader,
			navMenu
		}
	}

</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";

	.index {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
		height: 100vh;
		>div {
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin: 0 auto;
		}
		.main {
			position: relative; //因查看代码按钮定位而加
			flex-grow: 1; //不能少，否则main区会下沉
			.aside {
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
			}
			.right {
				@media only screen and (min-device-width: 1920px) {
					height: calc(100vh - 60px);
				}
				height: calc(100vh - 55px);
				flex-grow: 1;
				overflow: hidden;
				background-color: $color-mainArea;
				background-clip: content-box; //背景颜色延伸到内容外延
			}
		}
	}

</style>
