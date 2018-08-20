<template>
	<div class="topic-block">
		<deep-link :id="topic.id"></deep-link>

		<dynamic-heading :level="level + 1">{{ topic.header }}</dynamic-heading>

		<slot></slot>

		<div ref="paragraphs"></div>

		<topic-block
			v-for="section in topic.sections"
			:key="section.header"
			:topic="section"
			:level="level + 1"
		></topic-block>
	</div>
</template>

<script>
import DynamicHeading from './DynamicHeading.vue';
import DeepLink from './DeepLink.vue';

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
		for (let paragraphHTML of this.topic.paragraphs) {
			const p = this.createParagraph(paragraphHTML);
			this.$refs.paragraphs.appendChild(p);
		}
	},

	methods: {
		createParagraph(inerHTML) {
			const p = document.createElement('p');
			p.innerHTML = inerHTML;

			[].slice.call(p.querySelectorAll('a')).forEach(anchor => {
				const href = anchor.getAttribute('href');
				anchor.setAttribute('href', href.replace('https://www.britannica.com', ''));
			});

			return p;
		}
	}
};
</script>

<style lang="scss" scoped>
.topic-block {
	overflow: hidden;
}
</style>
