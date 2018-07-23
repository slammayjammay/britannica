<template>
	<div id="app">
		<sticky-component :scrollY="scrollY" :topic="topic"></sticky-component>

		<div class="flex">
			<div class="sidebar-placeholder sidebar-width"></div>
			<main-content :scrollY="scrollY" :topic="topic"/>
		</div>
	</div>
</template>

<script>
import StickyComponent from './StickyComponent.vue';
import MainContent from './MainContent.vue';
import eventBus from '../utils/event-bus';
import croatiaData from '../../topics/croatia';

export default {
	components: {
		StickyComponent,
		MainContent
	},
	data() {
		return {
			scrollY: null,
			topic: croatiaData
		};
	},
	mounted() {
		this._onResize = this._onResize.bind(this);
		this._onScroll = this._onScroll.bind(this);

		this._isSmoothScrolling = false;
		eventBus.$on('smoothscroll-begin', () => this._isSmoothScrolling = true);
		eventBus.$on('smoothscroll-end', () => this._isSmoothScrolling = false);

		this.scrollY = window.scrollY;

		window.addEventListener('resize', this._onResize);
		window.addEventListener('scroll', this._onScroll);

		window.addEventListener('load', () => {
			// need to wait a tick when deeplinking on load
			requestAnimationFrame(() => eventBus.$emit('app-init'));
		});
	},
	methods: {
		_onResize() {
			this.scrollY = window.scrollY;
			eventBus.$emit('resize');
		},

		_onScroll() {
			this.scrollY = window.scrollY;
			eventBus.$emit('scroll', { smoothscroll: this._isSmoothScrolling });
		}
	}
}
</script>

<style lang="scss">
$sidebar-width: 300px;
$subheader-color: #f2f2f2;

html, body {
	margin: 0;
}

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
