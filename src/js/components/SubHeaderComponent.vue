<template>
	<div class="subheader" :class="subheaderClass">
		<div class="sidebar-header sidebar-width subheader-color">Contents</div>
		<div class="main-content-header main-content-width subheader-color">
			<h1>{{ topic.intro.header }}</h1>
			<div class="scroll-indicator" ref="scrollIndicator"></div>
		</div>
	</div>
</template>

<script>
import TweenLite from 'gsap';
import eventBus from '../utils/event-bus';

export default {
	props: ['scrollY', 'topic'],
	data() {
		return {
			scrollingDistance: 0,
			isFinishedScrolling: false
		};
	},
	computed: {
		subheaderClass() {
			return this.isFinishedScrolling ? 'finished-scrolling' : '';
		}
	},
	mounted() {
		this._onResize = this._onResize.bind(this);
		this._onScroll = this._onScroll.bind(this);

		eventBus.$on('scroll', this._onScroll);
		eventBus.$on('resize', this._onResize);
		eventBus.$on('app-init', () => {
			this._resize();
			this._updateScrollIndicator();
		});
	},
	methods: {
		_updateScrollIndicator() {
			const widthPercentage = Math.min(1, this.scrollY / this.scrollingDistance);

			TweenLite.to(this.$refs.scrollIndicator, 0.25, {
				width: `${widthPercentage * 100}%`
			});

			this.isFinishedScrolling = (widthPercentage === 1);
		},

		async _onScroll() {
			await new Promise(resolve => requestAnimationFrame(resolve));
			this._updateScrollIndicator();
		},

		async _onResize() {
			await new Promise(resolve => requestAnimationFrame(resolve));
			this._resize();
			this._updateScrollIndicator();
		},

		_resize() {
			const mainContentEl = document.querySelector('.main-content .content');
			const mainContentTop = mainContentEl.offsetTop;
			const mainContentHeight = mainContentEl.offsetHeight;

			this.scrollingDistance = mainContentTop + mainContentHeight - window.innerHeight;
		}
	}
};
</script>

<style lang="scss" scoped>
$border-color: #ccc;

.subheader {
	position: sticky;
	top: 0;
	display: flex;

	.sidebar-header {
		border-left: 1px solid $border-color;
		border-bottom: 1px solid $border-color;
		border-right: 1px solid $border-color;
		box-sizing: border-box;
	}

	.main-content-header {
		border-bottom: 1px solid $border-color;
		position: relative;

		.scroll-indicator {
			$height: 3px;

			background: #084465;
			transition: background-color 0.25s;
			width: 0%;
			position: absolute;
			left: 0;
			bottom: -$height;
			height: $height;
		}
	}
}

.subheader.finished-scrolling {
	.scroll-indicator {
		background: #76a307;
	}
}
</style>
