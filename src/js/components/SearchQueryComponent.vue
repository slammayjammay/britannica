<template>
	<div class="search-query">
		<strong class="search-title">What are you looking for?</strong>

		<form class="form" action="/search" method="POST" ref="form" autocomplete="off">
			<label for="search-query">Search query:</label>
			<input id="search-query" class="search-input" name="search-query" type="text" ref="input"></input>
			<input class="submit" type="submit"></input>
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
import debounce from 'lodash.debounce';
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
		this._onInputType = debounce(this._onInputType.bind(this), 200);

		this.$refs.form.addEventListener('submit', this._onInputSubmit);
		this.$refs.input.addEventListener('keyup', this._onInputType);

		eventBus.$on('search-modal:focus-input', this._onModalInputFocus);
	},
	methods: {
		_onInputType(e) {
			const query = this.$refs.input.value;

			if (query.trim() === '') {
				return;
			}

			this.fetchSearchQuery(query).then(results => {
				this._updateResults(query, results);
			});
		},

		_onInputSubmit(e) {
			e.preventDefault();

			const query = this.$refs.input.value;

			this.fetchSearchQuery(query).then(results => {
				this._updateResults(query, results);
			});
		},

		fetchSearchQuery(query) {
			const promise = fetch('/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ 'search-query': query })
			});

			promise.catch(error => console.log(error))

			return promise.then(results => results.json());
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
	.search-title {
		font-size: 30px;
	}

	.form {
		margin-top: 30px;
	}

	.search-input {
		width: 300px;
		height: 30px;
		font-size: 15px;
	}

	.submit {
		box-sizing: border-box;
		padding: 5px;
		-webkit-appearance: none;

		&:hover {
			cursor: pointer;
		}
	}

	.results {
		text-align: left;
		padding-left: 3em;
	}
}
</style>
