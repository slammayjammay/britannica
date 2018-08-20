<template>
	<div class="topic-view" :class="klass">
		<template v-if="ready">
			<sticky-component :scrollY="scrollY" :topic="topic"></sticky-component>

			<div class="flex">
				<div class="sidebar-placeholder sidebar-width"></div>
				<main-content :scrollY="scrollY" :topic="topic"/>
			</div>
		</template>
	</div>
</template>

<script>
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
			ready: false,
			topic: null,
			isCollapsed: false,
			topic: []
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

		const { category, topic } = this.$route.params;

		const needsFilling = await new Promise(resolve => {
			this.fetch(`/${category}/${topic}`, { scrapeStructure: true })
			.catch(error => console.log(error))
			.then(response => response.json())
			.then(data => {
				this.structure = new Structure(data.intro, data.sections);

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

		const nextUrl = await new Promise(resolve => {
			this.fetch(`/${category}/${topic}`)
			.catch(error => console.log(error))
			.then(response => response.json())
			.then(data => {
				if (data.intro) {
					this.structure.fillIntro(data.intro);
				}

				this.structure.fill(data.sections);

				resolve(data.nextUrl);
			});
		});

		this.init();

		if (nextUrl) {
			this.continuouslyFill(nextUrl);
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

		continuouslyFill(nextUrl) {
			this.fetch(nextUrl)
			.catch(error => console.log(error))
			.then(response => response.json())
			.then(data => {
				this.structure.fill(data.sections);

				this.onStructureFilled();

				if (data.nextUrl) {
					this.continuouslyFill(data.nextUrl);
				}
			});
		},

		init() {
			this.topic = {
				intro: this.structure.intro,
				sections: this.structure.tree.sections
			};

			this.ready = true;

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
