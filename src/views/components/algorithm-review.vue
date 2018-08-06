<template>
	<div class="review-container">
		<div class="algorithm-review">
			<div v-for="index in algorithmReview.length" :key="index" class="review-text" :style="{'min-width': cardMinWidth, animation: `${fadeInUp(index)} 1s ${(index - 1) / 2}s forwards`}"
			  v-html="`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${algorithmReview[index - 1]}`"></div>
		</div>
	</div>
</template>

<script>
	import {
		algorithmReview
  } from '@/assets/textData/algorithmReview'
  import JS2CSSKeyframes from 'js2css3'
	export default {
		computed: {
			algorithmReview: function () {
				for (const item of algorithmReview) {
					if (item.index == this.$store.getters.selectedAlgorithm) {
						return item.review;
					}
				}
			},
			cardMinWidth: function () {
				return (1 / this.algorithmReview.length * 100).toFixed(2) + '%';
      }
		},
		mounted() {
			this.$store.commit('changeAlgorithm', this.$route.path.substring(1, this.$route.path.indexOf('/', 1)));
    },
    methods: {
        fadeInUp(index) {
        var ani = new JS2CSSKeyframes('ani_1', {
          '0%': {
            opacity: 0,
            transform: `translate3d(0, ${(6 - index) * 8}px, 0)`
          },
          '100%': {
            opacity: 1,
            transform: `none`
          }
        })
        return ani.name
      }
    }
	}

</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";
	.review-container {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 15px 30px;
		display: flex;
		align-items: center;
		.algorithm-review {
			flex-shrink: 0;
			width: 900px;
			margin: auto;
			.review-text {
				box-sizing: border-box;
				width: 100%;
				border: 1px solid $color-theme;
				background-color: $color-navbg;
				border-radius: 8px;
				margin: 15px auto;
				padding: 15px;
				font-size: 1em;
				line-height: 1.8;
				opacity: 0;
			}
		}
  }

</style>
