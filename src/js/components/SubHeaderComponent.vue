<template>
	<div class="subheader">
		<div class="sidebar-header sidebar-width subheader-color">Contents</div>
		<div class="main-content-header main-content-width subheader-color">
			<h1>{{ topic.intro.header }}</h1>
			<div class="scroll-indicator" :style="scrollIndicatorStyle"></div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['scrollY', 'topic'],
	data() {
		return {
			scrollingDistance: 0
		};
	},
	mounted() {
		this._onResize = this._onResize.bind(this);

		this._resize();

		window.addEventListener('resize', this._onResize);
	},
	computed: {
		scrollIndicatorStyle() {
			return {
				width: `${this.scrollY / this.scrollingDistance * 100}%`
			};
		}
	},
	methods: {
		_onResize() {
			this._resize();
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

			width: 0%;
			transition: 100ms;
			position: absolute;
			left: 0;
			bottom: -$height;
			height: $height;
			background: #084465;
		}
	}
}
</style>
