<template>
	<span role="button" class="header-search" :class="klass">
		<span>SEARCH BRITANNICA</span>
		<span class="search-icon"></span>
		<span class="close-icon">&times;</span>
	</span>
</template>

<script>
import eventBus from '../utils/event-bus';

export default {
	mounted() {
		this._onModalOpen = this._onModalOpen.bind(this);
		this._onModalClose = this._onModalClose.bind(this);

		eventBus.$on('search-modal:open', this._onModalOpen);
		eventBus.$on('search-modal:close', this._onModalClose);

		this.$el.addEventListener('click', e => {
			eventBus.$emit('search-modal:toggle');
		});
	},
	data() {
		return {
			modalOpen: false
		};
	},
	computed: {
		klass() {
			return this.modalOpen ? 'modal-open' : '';
		}
	},
	methods: {
		_onModalOpen() {
			this.modalOpen = true;
		},

		_onModalClose() {
			this.modalOpen = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.header-search {
	padding-left: 5px;
	padding-right: 5px;
	display: inline-block;
	float: right;

	&:hover {
		cursor: pointer;
	}

	&.modal-open {
		background: white;
		color: #084465;

		.search-icon {
			display: none;
		}

		.close-icon {
			display: inline-block;
		}
	}

	.search-icon {
		display: inline-block;
		vertical-align: middle;
		width: 15px;
		height: 15px;
		background-image: url('http://www.clker.com/cliparts/v/C/2/9/I/6/search-icon-white.svg');
		background-size: 30px;
		background-position: center;
		background-color: transparent;
	}

	.close-icon {
		display: none;
	}
}
</style>
