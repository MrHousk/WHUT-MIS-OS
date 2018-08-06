<template>
	<!-- demoAndCode区域公共的组件，银行家因无算法的选择，没有用到，单独重写了 -->
	<div class="demo-code" key="demoCode">
		<div class="demo">
			<m-return @click="$emit('page-return')"></m-return>
			<slot></slot>
		</div>
		<div class="expand-button" @click="$emit('expand-code')">
			<div class="text">查看代码</div>
		</div>
		<transition name="fadeRight">
			<div v-show="codeAreaShow" :class="['code-area',$store.getters.isCollapse?'code-area-wide':'code-area-narrow']">
				<el-tabs type="border-card" class="algorithm-tab" v-model="selectAlgorithmTab">
					<el-tab-pane label="C算法" name="C">
						<slot name="code"></slot>
					</el-tab-pane>
				</el-tabs>
				<div class="shrink-code-arrow">
					<i class="el-icon-d-arrow-right" @click="$emit('shrink-code')"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				selectAlgorithmTab: 'C'
			}
		},
		props: {
			codeAreaShow: Boolean
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/styles/vars.scss';
	.demo-code {
		display: flex;
		overflow: hidden;
		height: 100%; //保证窗口缩小自适应，子元素高度100%
		.demo {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			overflow: auto;
			height: 100%;
		}
		.expand-button {
			position: absolute;
			width: 150px;
			height: 150px;
			border-radius: 50%;
			font-size: 1.125rem; // padding:10px 6px;
			border: 1px solid $color-theme;
			background-color: $color-theme;
			color: #fff;
			opacity: 0.7;
			top: 30%;
			left: calc(100vw - 45px);
			writing-mode: vertical-lr;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;
			cursor: pointer;
			.text {
				position: relative;
				left: -50px;
				font-size: 1em;
				letter-spacing: 3px;
			}
			&:hover {
				opacity: 1;
			}
		}

		.code-area {
			@media only screen and (min-device-width: 1920px) {
				margin-left:200px;
				height: calc(100vh - 55px);
			}
			@media only screen and (min-device-width:1024px)and (max-device-width:1359px) {
				margin-left: 70px;
			}
			display: flex;
			flex-direction: column;
			position: fixed;
			margin-left:130px;
			margin-top:-46px;
			height: calc(100vh - 55px);
			border: 1px solid $color-dividingLine;
			background: #fff;
			box-shadow:-1px 0 60px #333;
			transition: .6s width ease-in-out;
			z-index: 10000;
			user-select: text;
			.algorithm-tab {
				height: 100%;
				overflow: auto;
			}
			.shrink-code-arrow {
				@media only screen and (min-device-width: 1920px) {
					margin-top:calc((100vh - 60px)*0.5);
				}
				position: fixed;
				margin-left:2px; //fixed定位后使用margin-left可基于父元素定位
				margin-top:calc((100vh - 55px)*0.5);
				cursor: pointer;
				opacity: 0.8;
				z-index: 2;
				[class^="el-icon-"] {
					font-size: 2rem;
					color: $color-theme;
					transition: 0.4s linear;
				}
				[class^="el-icon-"]:hover {
					transform: translateX(8px);
				}
			}
		}
		.code-area-wide {
			@media only screen and (min-device-width: 1920px) {
				width: calc(100vw - 200px - 66px - 4px);
			}
			@media only screen and (min-device-width:1024px)and (max-device-width:1359px) {
				width: calc(100% - 70px - 63px);
			}
			width: calc(100% - 130px - 66px);
		}
		.code-area-narrow {
			@media only screen and (min-device-width: 1920px) {
				width: calc(100vw - 200px - 200px + 4px);
			}
			@media only screen and (min-device-width:1024px)and (max-device-width:1359px) {
				width: calc(100vw - 70px - 190px);
			}
			width: calc(100vw - 130px - 192px);
		}
	}
</style>

<style lang="scss">
	@import '~@/styles/vars.scss';
	.hljs {
		margin: 0;
		font-size: 16px;
	}

	.el-tabs__content {
		overflow: auto;
	}

	.el-tabs--border-card {
		box-shadow: none;
		border: none;
		>.el-tabs__content {
			padding: 0;
		}
	}
</style>
