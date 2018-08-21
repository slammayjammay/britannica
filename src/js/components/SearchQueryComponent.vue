<template>
	<div class="search-query">
		<form action="/search" method="POST" ref="form">
			<label for="search-query">Search query:</label>
			<input id="search-query" class="search-input" name="search-query" type="text" ref="input"></input>
			<input type="submit"></input>
		</form>

		<div class="results" v-if="searchResults !== null">
			<h2>Showing results for "{{ searchQuery }}"</h2>
			<ul>
				<li tag="li" v-for="result in searchResults.results">
					<a :href="`${result.url[0] === '/' ? '' : '/'}${result.url}`">{{ result.title }}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import eventBus from '../utils/event-bus';

export default {
	data() {
		return {
			searchQuery: null,
			searchResults: null
		};
	},
	async mounted() {
		this._onInputSubmit = this._onInputSubmit.bind(this);
		this._onModalInputFocus = this._onModalInputFocus.bind(this);

		this.$refs.form.addEventListener('submit', this._onInputSubmit);
		eventBus.$on('search-modal:focus-input', this._onModalInputFocus);
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
		},

		_onModalInputFocus() {
			this.$nextTick(() => this.$refs.input.focus());
		}
	}
};
</script>

<style lang="scss" scoped>
.search-query {
	.search-input {
		width: 300px;
		height: 30px;
		font-size: 15px;
	}

	.results {
		text-align: left;
		padding-left: 3em;
	}
}
</style>
