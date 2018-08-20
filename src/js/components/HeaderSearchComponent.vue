<template>
	<span role="button" class="header-search" :class="klass">
		<span>SEARCH BRITANNICA</span>
		<div class="search-icon"></div>
		<div class="search-modal" ref="modal">
			<strong class="label">What are you looking for?</strong>
		</div>
	</span>
</template>

<script>
export default {
	mounted() {
		window.addEventListener('click', e => {
			const clickedInsideEl = this.$el.contains(e.target);
			const clickedInsideModal = this.$refs.modal.contains(e.target);
			const clickedButton = (clickedInsideEl && !clickedInsideModal);

			if (this.isSearching && clickedButton) {
				this.closeModal();
			} else if (this.isSearching && !clickedInsideEl) {
				this.closeModal();
			} else if (!this.isSearching && clickedButton) {
				this.openModal();
			}
		});
	},
	data() {
		return {
			isSearching: false
		};
	},
	computed: {
		klass() {
			return this.isSearching ? 'is-searching' : '';
		}
	},
	methods: {
		openModal() {
			this.isSearching = true;
		},

		closeModal() {
			this.isSearching = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.header-search {
	float: right;

	&:hover {
		cursor: pointer;
	}

	&.is-searching {
		.search-modal {
			display: block;
		}
	}

	.search-icon {
		display: inline-block;
		vertical-align: middle;
		width: 20px;
		height: 20px;
		background-image: url('http://www.clker.com/cliparts/v/C/2/9/I/6/search-icon-white.svg');
		background-size: cover;
		background-position: center;
		background-color: transparent;
		margin-left: -4px;
	}

	.search-modal {
		display: none;
		position: absolute;
		z-index: 1;
		left: 0;
		width: 100vw;
		height: 100px;
		background: white;
		text-align: center;
		color: black;

		.label {
			font-size: 30px;
		}
	}
}
</style>
