<template>
	<div class="subheader" :class="subheaderClass">
		<div class="sidebar-header sidebar-width subheader-color">
			<button class="sidebar-collapse-button" ref="sidebarCollapseButton">&times;</button>
		</div>
		<div class="main-content-header main-content-width subheader-color">
			<button class="sidebar-open-button" ref="sidebarOpenButton">+</button>
			<h1 v-if="topic" class="h1">{{ topic.intro.header }}</h1>
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
			isFinishedScrolling: false,
			isCollapsed: false
		};
	},
	computed: {
		subheaderClass() {
			return {
				'finished-scrolling' : this.isFinishedScrolling,
				'collapsed' : this.isCollapsed
			};
		}
	},
	mounted() {
		this._onResize = this._onResize.bind(this);
		this._onScroll = this._onScroll.bind(this);

		this._mainContentEl = null;

		this.$refs.sidebarCollapseButton.addEventListener('click', () => eventBus.$emit('sidebar-collapse'));
		this.$refs.sidebarOpenButton.addEventListener('click', () => eventBus.$emit('sidebar-open'));

		eventBus.$on('scroll', this._onScroll);
		eventBus.$on('resize', this._onResize);
		eventBus.$on('sidebar-collapse', () => this.isCollapsed = true);
		eventBus.$on('sidebar-open', () => this.isCollapsed = false);

		this._resize();
		this._updateScrollIndicator();
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
			this._mainContentEl = document.querySelector('.main-content .content');

			if (!this._mainContentEl) {
				eventBus.$once('blocks-fetched', () => this._resize());
				return;
			}

			const mainContentTop = this._mainContentEl.offsetTop;
			const mainContentHeight = this._mainContentEl.offsetHeight;

			this.scrollingDistance = mainContentTop + mainContentHeight - window.innerHeight;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../scss/settings';

$border-color: #ccc;

button {
	border: none;
	background: initial;

	&:hover {
		cursor: pointer;
	}
}

.subheader {
	position: sticky;
	top: 0;
	display: flex;

	.sidebar-header {
		border-left: 1px solid $border-color;
		border-bottom: 1px solid $border-color;
		border-right: 1px solid $border-color;
		box-sizing: border-box;

		.sidebar-collapse-button {
			padding: 10px;
			font-size: 20px;
		}
	}

	.main-content-header {
		box-sizing: border-box;
		height: $header-bottom-height;
		border-bottom: 1px solid $border-color;
		position: relative;

		.sidebar-open-button {
			display: none;
		}

		.h1 {
			display: inline-block;
		}

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

.subheader.collapsed {
	.sidebar-header {
		display: none;
	}

	.sidebar-open-button {
		display: inline-block;
	}
}
</style>
