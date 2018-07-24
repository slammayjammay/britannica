<template>
	<div class="search-query">
		<form ref="form">
			<label>Search query:</label>
			<input type="text" ref="input"></input>
			<input type="submit"></input>
		</form>
	</div>
</template>

<script>
export default {
	async mounted() {
		const query = await this._promptForSearchQuery();
	},
	methods: {
		_promptForSearchQuery() {
			return new Promise(resolve => {
				this.$refs.form.addEventListener('submit', e => {
					// e.preventDefault();
					// resolve(this.$refs.input.value);
				});
			});
		},

		_fetchSearchQuery(query) {
			return new Promise(resolve => {
				// request.get(SEARCH_URL, (error, res, body) => {
				// 	if (error) {
				// 		return resolve({ error });
				// 	}
				//
				// 	if (res.statusCode !== 200) {
				// 		return resolve({ error: new Error(`Status code: ${res.statusCode}`) });
				// 	}
				//
				// 	resolve({ body });
				// });
			});
		}
	}
};
</script>

<style lang="scss" scoped></style>
