<template>
	<div class="definition-modal-container" :class="klass">
		<div class="corner" ref="corner"></div>

		<div class="definition-modal" ref="modal">
			<template v-if="isLoaded">
				<strong class="about">{{ data.word }}</strong>
				<em class="about">{{ data.partOfSpeech }}</em>
				<span class="about">{{ data.syllables }}</span>

				<a class="full-definition" :href="`https://www.merriam-webster.com/dictionary/${data.word}`">SEE FULL</a>

				<ul>
					<li v-for="definition in data.definitions">{{ definition }}</li>
				</ul>
			</template>

			<template v-else-if="isLoading">
				<main-content-loader/>
			</template>
		</div>
	</div>
</template>

<script>
import MainContentLoader from './MainContentLoader.vue';
import eventBus from '../utils/event-bus';

export default {
	components: {
		MainContentLoader
	},
	data() {
		return {
			data: {},
			isLoading: false,
			isLoaded: false
		}
	},
	computed: {
		klass() {
			const classes = [];

			if (this.isLoading) classes.push('loading');
			if (this.isLoaded) classes.push('loaded');

			return classes.join(' ');
		}
	},
	mounted() {
		this._onDictionaryLinkClick = this._onDictionaryLinkClick.bind(this);
		this._onResize = this._onResize.bind(this);

		this._mainContentEl = document.querySelector('.main-content .content');
		this._containerWidth = this._containerHeight = null;

		eventBus.$on('resize', this._onResize);
		eventBus.$on('dictionary-link-click', this._onDictionaryLinkClick);

		window.addEventListener('click', e => {
			if (!this.isLoaded && !this.isLoading || e.target.hasAttribute('data-dictionary-link')) {
				return;
			}

			if (!this.$el.contains(e.target)) {
				this.isLoaded = this.isLoading = false;
			}
		});
	},
	methods: {
		_onResize() {
			this._containerWidth = this._mainContentEl.offsetWidth;
			this._containerHeight = this._mainContentEl.offsetHeight;
		},

		_onDictionaryLinkClick(el) {
			const word = el.getAttribute('data-word');

			if (word === this.data.word) {
				if (this.isLoaded) {
					this.isLoading = this.isLoaded = false;
				} else {
					this.isLoaded = true;
				}

				return;
			}

			this.isLoading = true;
			this.isLoaded = false;
			this.data = {};

			const dimensions = {
				elWidth: this.$refs.modal.offsetWidth,
				elHeight: this.$refs.modal.offsetHeight,
				targetTop: el.offsetTop,
				targetLeft: el.offsetLeft,
				targetWidth: el.offsetWidth,
				targetHeight: el.offsetHeight
			};

			this._updatePosition(dimensions);

			fetch('/dictionary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ word })
			})
				.catch(error => console.log(error))
				.then(response => response.json())
				.then(data => {
					this.isLoading = false;
					this.isLoaded = true;
					this.data = data;
					this._updatePosition(dimensions);
				});
		},

		_updatePosition(dimensions) {
			const marginTop = 18;

			let top = dimensions.targetTop + dimensions.targetHeight;
			let left = dimensions.targetLeft + dimensions.targetWidth / 2 - dimensions.elWidth / 2;
			let cornerTop = top + marginTop - 10;
			let cornerLeft = dimensions.targetLeft + dimensions.targetWidth / 2;

			if (top + dimensions.elHeight > this._containerHeight) {
				top = this._containerHeight - dimensions.elHeight;
			}

			if (left < 0) {
				left = 0;
			} else if (left + dimensions.elWidth > this._containerWidth) {
				left = this._containerWidth - dimensions.elWidth;
			}

			this.$refs.modal.style.top = `${top + marginTop}px`;
			this.$refs.modal.style.left = `${left}px`;
			this.$refs.corner.style.top = `${cornerTop}px`;
			this.$refs.corner.style.left = `${cornerLeft}px`;
		}
	}
};
</script>

<style lang="scss" scoped>
$background: wheat;

.definition-modal-container {
	&.loaded, &.loading {
		.corner, .definition-modal {
			visibility: visible;
		}
	}

	.corner, .definition-modal {
		visibility: hidden;
	}

	.corner {
		position: absolute;
		top: -10px;
		width: 20px;
		height: 20px;
		background: $background;
		transform: translateX(-50%) rotate(45deg);
	}

	.definition-modal {
		position: absolute;
		z-index: 1;
		background: $background;
		padding: 15px;
		width: 450px;
		height: 200px;
		box-sizing: border-box;

		.about {
			margin-right: 15px;
		}

		.full-definition {
			float: right;
		}

		ul {
			list-style-type: decimal;
			margin-bottom: 0;
			height: 130px;
			overflow: scroll;

			li {
				margin-bottom: 12px;
			}
		}
	}
}
</style>
