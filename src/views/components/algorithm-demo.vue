<template>
	<div class="algorithm-demo">
		<div v-if="algoIndexShow && $store.getters.selectedAlgorithm !== 'banker'" class="demo-entrance">
			<el-carousel ref="childAlgorithmNav" :autoplay="false" trigger="click" type="card" height="300px" @change="change">
				<el-carousel-item v-for="item in childAlgorithmNav" :key="item.index">
					<div class="nav-text-area" @click="selectChildAlgorithm">
						<div class="nav-text">{{ item.text }}</div>
						<div class="nav-translation">{{ item.translation }}</div>
					</div>
				</el-carousel-item>
			</el-carousel>

      <div class="introduction-cards">
        <el-card class="introduction-card" :style="{'min-width': cardMinWidth}" v-for="item in algorithmIntroduction[currentCarouselIndex]"
          :key="item">
          <div slot="header" class="introduction-title">
            <span>{{item.title}}</span>
          </div>
          <div class="introduction-text" v-html="`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.text}`"></div>
        </el-card>
      </div>
		</div>
		<div v-else class="demo">
			<banker v-if="$store.getters.selectedAlgorithm == 'banker'" @page-return="returnPage"></banker>
			<processorSchedule v-if="$store.getters.selectedAlgorithm == 'processorSchedule'" :selectedAlgorithmIndex="childAlgorithmNav[currentCarouselIndex].index"
			  :selectedAlgorithmText="selectedAlgorithmText" @page-return="returnPage"></processorSchedule>
			<memoryPartition v-if="$store.getters.selectedAlgorithm == 'memoryPartition'" :selectedAlgorithmIndex="childAlgorithmNav[currentCarouselIndex].index"
			  :selectedAlgorithmText="selectedAlgorithmText" @page-return="returnPage"></memoryPartition>
			<pageReplace v-if="$store.getters.selectedAlgorithm == 'pageReplace'" :selectedAlgorithmIndex="childAlgorithmNav[currentCarouselIndex].index"
			  :selectedAlgorithmText="selectedAlgorithmText" @page-return="returnPage"></pageReplace>
			<diskSchedule v-if="$store.getters.selectedAlgorithm == 'diskSchedule'" :selectedAlgorithmIndex="childAlgorithmNav[currentCarouselIndex].index"
			  :selectedAlgorithmText="selectedAlgorithmText" @page-return="returnPage"></diskSchedule>
			<encryptDecode v-if="$store.getters.selectedAlgorithm == 'encryptDecode'" :selectedAlgorithmIndex="childAlgorithmNav[currentCarouselIndex].index"
			  :selectedAlgorithmText="selectedAlgorithmText" @page-return="returnPage"></encryptDecode>
		</div>
	</div>
</template>

<script>
	import banker from '@/views/banker/banker-demo'
	import processorSchedule from '@/views/processorSchedule/processorSchedule-demo'
	import memoryPartition from '@/views/memoryPartition/memoryPartition-demo'
	import pageReplace from '@/views/pageReplace/pageReplace-demo'
	import diskSchedule from '@/views/diskSchedule/diskSchedule-demo'
	import encryptDecode from '@/views/encryptDecode/encryptDecode-demo'
	import {
		childAlgorithmNav
	} from '@/assets/textData/childAlgorithmNav'
	import {
		introduction
	} from '@/assets/textData/introduction'
	export default {
		data() {
			return {
				algoIndexShow: true,
				childAlgorithmNav: [],
				currentCarouselIndex: 0,
				algorithmIntroduction: [],
			};
		},
		computed: {
			cardMinWidth: function () {
				return (1 / this.algorithmIntroduction[0].length * 100).toFixed(2) + '%';
			},
			selectedAlgorithmText: function () {
				for (const item of this.childAlgorithmNav) {
					if (item.index == this.childAlgorithmNav[this.currentCarouselIndex].index) {
						return item.text;
					}
				}
			}
		},
		mounted() {
			this.$store.commit('changeAlgorithm', this.$route.path.substring(1, this.$route.path.indexOf('/', 1)));
			this.requestTextData();
		},
		methods: {
			change(currentCarouselIndex) {
				this.currentCarouselIndex = currentCarouselIndex;
			},
			selectChildAlgorithm() {
				this.algoIndexShow = false;
			},
			requestTextData() {
				this.childAlgorithmNav = childAlgorithmNav[this.$store.getters.selectedAlgorithm];
				this.algorithmIntroduction = introduction[this.$store.getters.selectedAlgorithm];
			},
			returnPage() {
				this.algoIndexShow = true;
			}
		},
		components: {
			banker,
			processorSchedule,
			memoryPartition,
			pageReplace,
			diskSchedule,
			encryptDecode
		}
	};

</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";
	.algorithm-demo {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0 0 0 20px;
		.demo-entrance {
			min-width: 950px;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			.el-carousel {
				@media only screen and (min-device-width: 1920px) {
					width: 1000px;
				}
				width: 800px;
				margin: 0 auto;
				.nav-text-area {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.nav-text {
						border-bottom: 1px solid #fff;
						margin-bottom: 6px;
						padding-bottom: 6px;
					}
					.nav-translation {
						font-family: 'Helvetica Neue';
					}
				}
			}
			.introduction-cards {
				@media only screen and (min-device-width: 1920px) {
					width: 1200px;
				}
				display: flex;
				justify-content: space-between;
				margin-top: 25px;
				width: 950px;
				margin: 10px auto 0;
				.introduction-card {
					border-radius: 20px;
					box-shadow: 0px 1px 20px rgba(83, 83, 68, 0.3), 3px 3px 20px rgba(83, 83, 68, 0.3), -1px 3px 20px rgba(83, 83, 68, 0.3);
          box-sizing: border-box;
          animation: zoomInDown 1.5s;
					&:not(:last-child) {
						margin-right: 16px;
					}
					.introduction-title {
						color: #fff;
						font-size: 1.2em;
						font-weight: 600;
					}
					.introduction-text {
						color: #fff;
						line-height: 1.8;
						font-size: 1.1em;
					}
				}
				> :nth-child(1) {
					border: 1px solid $color-theme3;
					background-color: $color-theme3;
				}
				> :nth-child(2) {
					border: 1px solid $color-theme3;
					background-color: $color-theme3;
				}
				> :nth-child(3) {
					border: 1px solid $color-theme3;
					background-color: $color-theme3;
				}
			}
		}
		.demo {
			height: 100%;
		}
	}

</style>

<style lang="scss">
	@import "~@/styles/vars.scss";
	.algorithm-demo {
		.el-card__body {
			padding-top: 14px;
		}
	}

</style>
