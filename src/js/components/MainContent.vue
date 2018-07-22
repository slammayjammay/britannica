<template>
	<div class="main-content">
		<div class="content" ref="content">
			<topic-block :topic="topic.intro">
				<p>WRITTEN BY: {{ topic.intro.writtenBy.join(', ') }}</p>
				<p>LAST UPDATED: {{ topic.intro.lastUpdated }}</p>
			</topic-block>

			<topic-block
				v-for="section in topic.sections"
				:key="section.header"
				:topic="section"
				:level="1"
			></topic-block>
		</div>
		<main-content-sidebar :topic="topic"></main-content-sidebar>
	</div>
</template>

<script>
import MainContentSidebar from './MainContentSidebar.vue';
import TopicBlock from './TopicBlock.vue';
import eventBus from '../utils/event-bus';

export default {
	props: ['scrollY', 'topic'],
	components: {
		MainContentSidebar,
		TopicBlock
	},
	mounted() {
		this._init = this._init.bind(this);
		this._onScroll = this._onScroll.bind(this);

		eventBus.$on('app-init', this._init);
	},
	methods: {
		_init() {
			this.lastScrollY = this.scrollY;
			this.scrollDir = 0;
			this.offsets = [];
			this.currentScrollIdx = null;

			const blocks = [].slice.call(this.$refs.content.querySelectorAll('.topic-block:not(:first-child)'));
			this.offsets = blocks.map(el => el.offsetTop - 146);
			this.currentScrollIdx = this._getScrollIdx(this.scrollY, -1);
			eventBus.$emit('scroll-active-block', this.currentScrollIdx);

			eventBus.$on('scroll', this._onScroll);
		},

		_onScroll(options = {}) {
			if (options.smoothscroll) {
				return;
			}

			if (this.scrollDir < 0 && this.scrollY < this.offsets[this.currentScrollIdx - 1]) {
				this.currentScrollIdx = this._getScrollIdx(this.scrollY, this.currentScrollIdx - 1, -1);
				eventBus.$emit('scroll-active-block', this.currentScrollIdx);
			} else if (this.scrollDir > 0 && this.scrollY > this.offsets[this.currentScrollIdx]) {
				this.currentScrollIdx = this._getScrollIdx(this.scrollY, this.currentScrollIdx, 1);
				eventBus.$emit('scroll-active-block', this.currentScrollIdx);
			}

			this.scrollDir = (this.lastScrollY > this.scrollY) ? -1 : 1;
			this.lastScrollY = this.scrollY;
		},

		_getScrollIdx(scrollY, start = 0, dir = 1) {
			let idx = (dir > 0) ? start + 1 : start - 1;
			const end = (dir > 0) ? this.offsets.length - 1 : 0;

			while (true) {
				const isEnded = (dir > 0) ? (idx > end) : (idx < end);
				if (isEnded) {
					return end;
				}

				if (dir > 0 && scrollY < this.offsets[idx]) {
					return idx;
				}

				if (dir < 0 && scrollY > this.offsets[idx]) {
					return idx + 1;
				}

				idx += dir;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../scss/_settings.scss';

.main-content {
	display: flex;
	margin-top: $header-height;

	.content {
		flex-grow: 1;
		padding: 30px;
	}
}
</style>
