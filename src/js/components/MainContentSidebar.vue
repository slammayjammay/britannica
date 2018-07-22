<template>
	<div class="main-content-sidebar">
		<template v-for="fact in topic.facts">
			<div class="fact">
				<span class="fact-header">{{ fact.header }}</span>
				<p v-for="paragraph in fact.paragraphs" class="fact-paragraph">{{ paragraph }}</p>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	props: ['topic']
};
</script>

<style lang="scss" scoped>
.main-content-sidebar {
	width: 300px;
	flex-shrink: 0;
	padding: 20px;
	box-sizing: border-box;

	.fact {
		padding: 20px;

		&:nth-child(2n) {
			background: #f2f2f2;
		}

		&-header {
			font-weight: bold;
		}

		&-paragraph {
			margin: 0;
		}
	}
}
</style>
