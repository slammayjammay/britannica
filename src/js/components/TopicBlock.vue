<template>
	<div class="topic-block">
		<deep-link :id="topic.id"></deep-link>

		<dynamic-heading :level="level + 1">{{ topic.header }}</dynamic-heading>

		<slot></slot>

		<div>
			<template v-for="elementData of topic.elements">
				<div v-if="elementData.tagName === 'IMG'" v-html="elementData.html"/>
				<p v-if="elementData.tagName === 'P'" v-html="elementData.html"/>
			</template>
		</div>

		<topic-block
			v-for="section in topic.sections"
			:key="section.header"
			:topic="section"
			:level="level + 1"
		></topic-block>
	</div>
</template>

<script>
import Vue from 'vue';
import DynamicHeading from './DynamicHeading.vue';
import DeepLink from './DeepLink.vue';
import DefinitionComponent from './DefinitionComponent.vue';
import eventBus from '../utils/event-bus';

export default {
	name: 'topic-block',
	props: {
		topic: { type: Object },
		level: { type: Number, default: 0 }
	},
	components: {
		DynamicHeading,
		DeepLink
	},
	mounted() {
		this._onBlocksFetched = this._onBlocksFetched.bind(this);

		eventBus.$on('blocks-fetched', this._onBlocksFetched);
	},
	methods: {
		_onBlocksFetched() {
			this.setupDictionaryLinks();
		},

		setupDictionaryLinks() {
			const linkEls = [].slice.call(this.$el.querySelectorAll('[data-dictionary-link-target]'));

			for (let linkEl of linkEls) {
				const DefinitionConstructor = Vue.extend(DefinitionComponent);
				const instance = new DefinitionConstructor({
					propsData: {
						word: linkEl.getAttribute('data-dictionary-link-target'),
						href: linkEl.getAttribute('href')
					}
				});
				instance.$mount(linkEl);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.topic-block {
	overflow: hidden;
}
</style>
