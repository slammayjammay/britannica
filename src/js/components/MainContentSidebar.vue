<template>
	<div class="main-content-sidebar">
		<div class="fact-box" ref="factBox">
			<template v-for="fact in topic.facts">
				<div class="fact">
					<span class="fact-header">{{ fact.header.toUpperCase() }}</span>
					<div class="fact-paragraphs"></div>
					<p v-for="paragraphHTML in fact.paragraphs"
						v-html="paragraphHTML"
						class="fact-paragraph needs-link-parsing"
					/>
				</div>
			</template>
		</div>
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
	padding: 0 20px 20px 20px;
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
