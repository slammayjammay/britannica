<template>
	<div id="app">
		<breakpoint-component/>
		<topic-view-component v-if="IS_GH_PAGES" :IS_GH_PAGES="IS_GH_PAGES"/>
		<router-view v-else :scrollY="scrollY"></router-view>
	</div>
</template>

<script>
import BreakpointComponent from './BreakpointComponent.vue';
import TopicViewComponent from './TopicViewComponent.vue';
import eventBus from '../utils/event-bus';

export default {
	components: {
		BreakpointComponent,
		TopicViewComponent
	},
	props: {
		IS_GH_PAGES: { default: false }
	},
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
			this.$nextTick(() => eventBus.$emit('resize'));
		});

		eventBus.$on('resize', this._onResize);
		eventBus.$on('scroll', this._onScroll);
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
	margin: auto;
	min-width: $body-min-width;
	max-width: $body-max-width;
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

a {
	color: $link-color;

	&:hover {
		opacity: 0.8;
	}
}

.button-reset {
	background: none;
	border: none;
	padding: 0;
}
</style>
