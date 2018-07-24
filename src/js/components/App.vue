<template>
	<div id="app" :class="appClass">
		<search-query-component v-if="!isFetched"></search-query-component>

		<template v-if="isFetched">
			<sticky-component :scrollY="scrollY" :topic="topic"></sticky-component>

			<div class="flex">
				<div class="sidebar-placeholder sidebar-width"></div>
				<main-content :scrollY="scrollY" :topic="topic"/>
			</div>
		</template>
	</div>
</template>

<script>
import SearchQueryComponent from './SearchQueryComponent.vue';
import StickyComponent from './StickyComponent.vue';
import MainContent from './MainContent.vue';
import eventBus from '../utils/event-bus';
// import croatiaData from '../../topics/croatia';

export default {
	components: {
		SearchQueryComponent,
		StickyComponent,
		MainContent
	},
	data() {
		return {
			currentComponent: 'SearchQueryComponent',
			isFetched: false,
			scrollY: null,
			topic: null,
			isCollapsed: false
		};
	},
	computed: {
		appClass() {
			return {
				'collapsed': this.isCollapsed
			}
		}
	},
	async mounted() {
		// this._onResize = this._onResize.bind(this);
		// this._onScroll = this._onScroll.bind(this);
		//
		// this._isSmoothScrolling = false;
		//
		// window.addEventListener('resize', () => eventBus.$emit('resize'));
		// window.addEventListener('scroll', () => eventBus.$emit('scroll', { smoothscroll: this._isSmoothScrolling }));
		//
		// window.addEventListener('load', () => {
		// 	// need to wait a tick when deeplinking on load
		// 	requestAnimationFrame(() => eventBus.$emit('app-init'));
		// });
		//
		// eventBus.$on('resize', this._onResize);
		// eventBus.$on('scroll', this._onScroll);
		// eventBus.$on('sidebar-collapse', () => eventBus.$emit('resize'));
		// eventBus.$on('sidebar-open', () => eventBus.$emit('resize'));
		// eventBus.$on('sidebar-collapse', () => this.isCollapsed = true);
		// eventBus.$on('sidebar-open', () => this.isCollapsed = false);
		// eventBus.$on('smoothscroll-begin', () => this._isSmoothScrolling = true);
		// eventBus.$on('smoothscroll-end', () => this._isSmoothScrolling = false);
		//
		// this.scrollY = window.scrollY;
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
$sidebar-width: 300px;
$subheader-color: #f2f2f2;

html, body {
	margin: 0;
}

.flex {
	display: flex;
}

.collapsed {
	.sidebar-placeholder {
		display: none;
	}
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
