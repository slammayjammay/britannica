<template>
	<div class="topic-intro topic-block">
		<!-- <deep-link :id="topic.id">
			<h1 class="h1">{{ topic.header }}</h1>
		</deep-link>

		<p>WRITTEN BY: {{ topic.writtenBy.join(', ') }}</p>
		<p>LAST UPDATED: {{ topic.lastUpdated }}</p>

		<slot></slot>

		<p v-for="paragraph in topic.paragraphs">{{ paragraph }}</p> -->
	</div>
</template>

<script>
import DeepLink from './DeepLink.vue';

export default {
	props: ['topic'],
	components: {
		DeepLink
	}
};
</script>

<style lang="scss" scoped>
.topic-intro {
}
</style>
