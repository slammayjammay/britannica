<template>
	<div class="topic-view" :class="klass">
		<sticky-component :scrollY="scrollY" :topic="topic"></sticky-component>

		<div class="flex">
			<div class="sidebar-placeholder sidebar-width"></div>
			<main-content :scrollY="scrollY" :topic="topic"/>
		</div>
	</div>
</template>

<script>
import debounce from 'lodash.debounce';
import StickyComponent from './StickyComponent.vue';
import MainContent from './MainContent.vue';
import Structure from '../utils/Structure';
import eventBus from '../utils/event-bus';
import smoothScroll from '../utils/smooth-scroll';
import australiaStructure from '../../topics/australia.json';

export default {
	components: {
		StickyComponent,
		MainContent
	},
	props: ['scrollY'],
	data() {
		return {
			topic: null,
			isCollapsed: false
		};
	},
	computed: {
		klass() {
			return {
				'collapsed': this.isCollapsed
			}
		}
	},
	async mounted() {
		this.needsToDeepLink = !!this.$route.hash;

		eventBus.$once('scroll', () => this.needsToDeepLink = false);

		this._onImageLoad = debounce(() => {
			this.$nextTick(() => eventBus.$emit('resize'));
		}, 400);

		this.structure = australiaStructure;

		this.init();

		setTimeout(() => {
			eventBus.$emit('resize');
			eventBus.$emit('blocks-fetched');
		}, 0);
	},
	methods: {
		fetch(url, body) {
			return fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: body ? JSON.stringify(body) : null
			});
		},

		init() {
			this.topic = {
				intro: this.structure.intro,
				sections: this.structure.tree.sections,
				facts: this.structure.facts
			};

			this.$nextTick(() => this.onStructureFilled());
		},

		onStructureFilled() {
			[].slice.call(this.$el.querySelectorAll('img')).forEach(image => {
				image.addEventListener('load', this._onImageLoad);
			});

			this.$nextTick(() => {
				eventBus.$emit('resize');
				eventBus.$emit('blocks-fetched');

				if (this.needsToDeepLink) {
					const id = this.$route.hash.replace('#', '');
					const el = document.getElementById(id);

					if (el) {
						this.needsToDeepLink = false;
						smoothScroll(id);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.collapsed {
	.sidebar-placeholder {
		display: none;
	}
}
</style>
