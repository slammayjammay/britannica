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
const IS_GH_PAGES = false;

import debounce from 'lodash.debounce';
import StickyComponent from './StickyComponent.vue';
import MainContent from './MainContent.vue';
import Structure from '../utils/Structure';
import eventBus from '../utils/event-bus';
import smoothScroll from '../utils/smooth-scroll';

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
		this._wasCollapsedOnLarge = false;
		this._currentBreakpoint = null;

		eventBus.$once('scroll', () => this.needsToDeepLink = false);
		eventBus.$on('sidebar-open', () => this.isCollapsed = false);

		eventBus.$on('sidebar-collapse', () => {
			if (this._currentBreakpoint === 'large') {
				this._wasCollapsedOnLarge = true;
			}
			this.isCollapsed = true;
		});

		eventBus.$on('breakpoint', newBreakpoint => {
			this._currentBreakpoint = newBreakpoint;

			if (newBreakpoint === 'large' && this.isCollapsed && !this._wasCollapsedOnLarge) {
				eventBus.$emit('sidebar-open');
			} else if (newBreakpoint !== 'large' && !this.isCollapsed) {
				eventBus.$emit('sidebar-collapse');
			}
		});

		this._onImageLoad = debounce(() => {
			this.$nextTick(() => eventBus.$emit('resize'));
		}, 400);

		if (IS_GH_PAGES) {
			this.structure = require('../../topics/croatia.json');
			this.init();

			setTimeout(() => {
				eventBus.$emit('resize');
				eventBus.$emit('blocks-fetched');
			}, 0);
			return;
		}

		const { category, topic } = this.$route.params;

		const needsFilling = await new Promise(resolve => {
			this.fetch(`/${category}/${topic}`, { scrapeStructure: true })
			.catch(error => console.log(error))
			.then(response => response.json())
			.then(data => {
				this.structure = new Structure(data.intro, data.sections, data.facts);

				if (data.scraped) {
					this.structure.fillIntro(data.intro);
					this.structure.fill(data.sections);
					return resolve(false);
				}

				resolve(true);
			});
		});

		if (!needsFilling) {
			this.init();
			return;
		}

		const nextUrls = await new Promise(resolve => {
			this.fetch(`/${category}/${topic}`)
			.catch(error => console.log(error))
			.then(response => response.json())
			.then(data => {
				if (data.intro) {
					this.structure.fillIntro(data.intro);
				}

				this.structure.fill(data.sections);

				resolve(data.nextUrls);
			});
		});

		this.init();

		if (nextUrls) {
			for (let url of nextUrls) {
				this.fetch(url)
					.catch(error => console.log(error))
					.then(response => response.json())
					.then(data => {
						this.structure.fill(data.sections);
						this.onStructureFilled();
					});
			}
		}
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
.topic-view {
	&.collapsed {
		.sidebar-placeholder {
			display: none;
		}
	}

	.sidebar-placeholder {
		@include viewport(medium) {
			width: 0;
		}
	}
}
</style>
