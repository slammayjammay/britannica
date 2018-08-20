<script>
export default {
	props: {
		level: { type: Number, default: 1 }
	},
	render(createElement) {
		const level = Math.min(6, this.level);
		return createElement(`h${level}`, this.$slots.default);
	}
};
</script>
