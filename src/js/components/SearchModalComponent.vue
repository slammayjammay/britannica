<template>
	<div class="search-modal" :class="klass">
		<search-query-component/>
	</div>
</template>

<script>
import SearchQueryComponent from './SearchQueryComponent.vue';
import eventBus from '../utils/event-bus';

export default {
	components: {
		SearchQueryComponent
	},
	mounted() {
		this._onToggle = this._onToggle.bind(this);
		this._onClose = this._onClose.bind(this);
		this._onOpen = this._onOpen.bind(this);

		eventBus.$on('search-modal:toggle', this._onToggle);
		eventBus.$on('search-modal:close', this._onClose);
		eventBus.$on('search-modal:open', this._onOpen);
	},
	data() {
		return {
			isOpen: false
		};
	},
	computed: {
		klass() {
			return this.isOpen ? 'search-modal-open' : '';
		}
	},
	methods: {
		_onToggle() {
			if (this.isOpen) {
				eventBus.$emit('search-modal:close');
			} else {
				eventBus.$emit('search-modal:open');
			}
		},

		_onClose() {
			this.isOpen = false;
		},

		_onOpen() {
			this.isOpen = true;
			eventBus.$emit('search-modal:focus-input');
		}
	}
};
</script>

<style lang="scss" scoped>
.search-modal {
	display: none;
	position: absolute;
	z-index: 1;
	top: $header-top-height;
	left: 0;
	width: 100vw;
	background: white;
	text-align: center;
	color: black;
	padding-bottom: 5em;

	&-open {
		display: block;
	}
}
</style>
