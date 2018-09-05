<template>
	<div class="definition" :data-word="word.toLowerCase()">
		<a :href="href" @click="onClick" data-dictionary-link>{{ word }}</a>
	</div>
</template>

<script>
import eventBus from '../utils/event-bus';

export default {
	props: {
		word: { required: true },
		href: { required: true }
	},
	methods: {
		onClick(e) {
			e.preventDefault();
			eventBus.$emit('dictionary-link-click', this.$el);
		}
	}
};
</script>

<style lang="scss" scoped>
.definition {
	position: relative;
	display: inline-block;

	a {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px dashed $link-color;
	}
}
</style>
