<template>
	<div class="definition-modal-container" :class="klass">
		<div class="corner" ref="corner"></div>

		<div class="definition-modal" ref="modal">
			<template v-if="isLoaded">
				<div class="full-definition">
					<a :href="`https://www.merriam-webster.com/dictionary/${data.word}`">SEE FULL</a>
				</div>

				<strong class="about">{{ data.word }}</strong>
				<em class="about">{{ data.partOfSpeech }}</em>
				<span class="about">{{ data.syllables }}</span>

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
			isLoaded: false,
			linkEl: null,
			dimensions: null
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

			if (this.isLoading || this.isLoaded) {
				this._calculateDimensions();
				this._updatePosition();
			}
		},

		_onDictionaryLinkClick(el) {
			this.linkEl = el;
			const word = this.linkEl.getAttribute('data-word');

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

			this._calculateDimensions();
			this._updatePosition();

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
					this._updatePosition();
				});
		},

		_calculateDimensions() {
 			this.dimensions = {
				elWidth: this.$refs.modal.offsetWidth,
				elHeight: this.$refs.modal.offsetHeight,
				targetTop: this.linkEl.offsetTop,
				targetLeft: this.linkEl.offsetLeft,
				targetWidth: this.linkEl.offsetWidth,
				targetHeight: this.linkEl.offsetHeight
			};
		},

		_updatePosition() {
			const marginTop = 18;

			const {
				elWidth, elHeight, targetTop, targetLeft, targetWidth, targetHeight
			} = this.dimensions;

			let top = targetTop + targetHeight;
			let left = targetLeft + targetWidth / 2 - elWidth / 2;
			let cornerTop = top + marginTop - 10;
			let cornerLeft = targetLeft + targetWidth / 2;

			if (top + elHeight > this._containerHeight) {
				top = this._containerHeight - elHeight;
			}

			if (left < 0) {
				left = 0;
			} else if (left + elWidth > this._containerWidth) {
				left = this._containerWidth - elWidth;
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
		width: 400px;
		max-width: 100%;
		box-sizing: border-box;

		.about {
			margin-right: 15px;
		}

		.full-definition {
			margin-bottom: 8px;
		}

		ul {
			list-style-type: decimal;
			margin-bottom: 0;
			max-height: 130px;
			overflow: scroll;

			li {
				margin-bottom: 12px;
			}
		}
	}
}
</style>
