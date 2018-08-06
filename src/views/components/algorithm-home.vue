<template>
	<div class="algorithm-home">
		<div class="home-content">
			<div class="home-header">
				<div class="selected-algorithm">
					<m-icon name="dangqianweizhi"></m-icon>
					{{mapText}}
				</div>
				<div class="algorithm-nav">
					<el-menu ref="secondNavMenu" :default-active="activeIndex" mode="horizontal" router>
						<el-menu-item index="algorithm-review">算法概述</el-menu-item>
						<el-menu-item index="algorithm-demo">算法演示</el-menu-item>
						<el-menu-item index="algorithm-resource">算法课件</el-menu-item>
						<el-menu-item v-if="$store.getters.accountIdentity !== 'admin'" index="online-exercise">算法测试</el-menu-item>
					</el-menu>
				</div>
			</div>
			<div class="main">
				<transition name="fade" mode="out-in">
					<keep-alive include="exercise">
						<router-view :key="$route.path.replace(/\//g, '_')"></router-view>
					</keep-alive>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		algorithmMap
	} from '@/assets/textData/algorithmMap'
	import {
		map
	} from '@/utils'
	export default {
		computed: {
			activeIndex: function () {
				return this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1);
			},
			mapText: function () {
				return map(algorithmMap, this.$store.getters.selectedAlgorithm)
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";
	.algorithm-home {
		height: 100%;
		width: 100%;
		.home-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			width: 100%;
			.home-header {
				width: 100%;
				min-width: 1000px;
				margin: 0 auto;
				display: flex;
				flex-direction: column;
				align-items: center;
				.selected-algorithm {
					align-self: flex-start;
					flex-shrink: 0;
					padding: 10px 0 0 50px;
					color: $color-theme;
					font-size: 1.3em;
					font-weight: 600;
					.icon {
						width: 1em;
						height: 1em;
						position: relative;
						top: 0.1875em;
					}
				}
				.algorithm-nav {
					margin-top: -40px;
					.el-menu,
					.el-menu--horizontal .el-menu-item:hover,
					.el-menu--horizontal .el-menu-item:focus {
						background-color: $color-mainArea;
					}
				}
			}
			.main {
				height: calc(100vh - 98px);
				width: 100%;
				overflow: auto;
			}
		}
	}
</style>

<style lang="scss">
	@import "~@/styles/vars.scss";
	.algorithm-home {
		// 水平菜单导航
		.el-menu,
		.el-menu--horizontal .el-menu-item:hover,
		.el-menu--horizontal .el-menu-item:focus,
		.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
		.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
			background-color: $color-dividingLine;
		}

		.el-menu--horizontal {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
			border-bottom: solid 1px $color-dividingLine;
		}

		.el-menu--horizontal .el-menu-item {
      box-sizing: border-box;
			height: 50px;
			margin-right: 18px;
      color: #000;
      font-size: 1rem;
		}

		.el-menu--horizontal>:nth-last-child(1) {
			margin-right: 0px;
		}

		.el-menu--horizontal>.el-menu-item.is-active,
		.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
      border-bottom: 1px solid $color-theme;
		}
  }

</style>
