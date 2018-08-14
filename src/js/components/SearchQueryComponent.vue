<template>
	<div class="search-query">
		<form action="/search" method="POST" ref="form">
			<label for="search-query">Search query:</label>
			<input id="search-query" name="search-query" type="text" ref="input"></input>
			<input type="submit"></input>
		</form>

		<div v-if="searchResults !== null">
			<h2>Showing results for "{{ searchQuery }}"</h2>
			<ul>
				<li tag="li" v-for="result in searchResults.results">
					<router-link :to="result.url">{{ result.title }}</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchQuery: null,
			searchResults: null
		};
	},
	async mounted() {
		this._onInputSubmit = this._onInputSubmit.bind(this);

		this.$refs.form.addEventListener('submit', this._onInputSubmit);
	},
	methods: {
		_onInputSubmit(e) {
			e.preventDefault();

			const query = this.$refs.input.value;

			const fetched = fetch('/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					'search-query': query
				})
			});

			fetched.then(results => {
				results.json().then(results => this._updateResults(query, results));
			}).catch(error => {
				console.log(error);
			});
		},

		_updateResults(query, results) {
			this.searchQuery = query;
			this.searchResults = results;
		}
	}
};
</script>

<style lang="scss" scoped></style>
