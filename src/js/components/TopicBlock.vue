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
import DynamicHeading from './DynamicHeading.vue';
import DeepLink from './DeepLink.vue';
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
	}
};
</script>

<style lang="scss" scoped>
.topic-block {
	overflow: hidden;
}
</style>
