<template>
	<div id="app">
		<router-view :scrollY="scrollY"></router-view>
	</div>
</template>

<script>
import eventBus from '../utils/event-bus';

export default {
	data() {
		return {
			scrollY: null
		};
	},
	async mounted() {
		this._onResize = this._onResize.bind(this);
		this._onScroll = this._onScroll.bind(this);

		this._scrollFlags = null;

		window.addEventListener('resize', () => eventBus.$emit('resize'));
		window.addEventListener('scroll', () => {
			eventBus.$emit('scroll', this._scrollFlags || {});
		});

		window.addEventListener('load', () => {
			// need to wait a tick when deeplinking on load
			requestAnimationFrame(() => eventBus.$emit('app-init'));
		});

		eventBus.$on('resize', this._onResize);
		eventBus.$on('scroll', this._onScroll);
		eventBus.$on('sidebar-collapse', () => eventBus.$emit('resize'));
		eventBus.$on('sidebar-open', () => eventBus.$emit('resize'));
		eventBus.$on('sidebar-collapse', () => this.isCollapsed = true);
		eventBus.$on('sidebar-open', () => this.isCollapsed = false);
		eventBus.$on('smoothscroll-begin', (scrollFlags) => this._scrollFlags = scrollFlags);
		eventBus.$on('smoothscroll-end', () => this._scrollFlags = null);

		this.scrollY = window.scrollY;
	},
	methods: {
		_onResize() {
			this.scrollY = window.scrollY;
		},

		_onScroll() {
			this.scrollY = window.scrollY;
		}
	}
}
</script>

<style lang="scss">
html, body {
	margin: 0;
}

$sidebar-width: 300px;
$subheader-color: #f2f2f2;

.flex {
	display: flex;
}

.sidebar-width {
	width: $sidebar-width;
	flex-shrink: 0;
}

.subheader-color {
	background: $subheader-color;
}

.main-content-width {
	flex-grow: 1;
}
</style>
