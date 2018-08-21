<template>
	<div class="main-content">
		<div class="content" ref="content">
			<topic-block :topic="topic.intro" class="topic-block-intro">
				<p v-if="topic.intro.writtenBy.length > 0">WRITTEN BY: {{ topic.intro.writtenBy.join(', ') }}</p>
				<p v-if="topic.intro.lastUpdated">LAST UPDATED: {{ topic.intro.lastUpdated }}</p>
				<p v-if="topic.intro.warning">{{ topic.intro.warning }}</p>
			</topic-block>

			<topic-block
				v-for="section in topic.sections"
				v-if="section.isFilled"
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
		this.init = this.init.bind(this);
		this._onScroll = this._onScroll.bind(this);

		this.init();

		this.offsets = this._calculateOffsets();
		this.currentScrollIdx = this._getScrollIdx(this.scrollY, -1);
		eventBus.$emit('scroll-active-block', this.currentScrollIdx);

		eventBus.$on('resize', () => {
			this.offsets = this._calculateOffsets();
			this.currentScrollIdx = this._getScrollIdx(this.scrollY, -1);
			eventBus.$emit('scroll-active-block', this.currentScrollIdx);
		});
	},
	methods: {
		init() {
			this.lastScrollY = this.scrollY;
			this.scrollDir = 0;
			this.offsets = [];
			this.currentScrollIdx = null;

			eventBus.$on('scroll', this._onScroll);
		},

		_calculateOffsets() {
			const blocks = [].slice.call(
				this.$refs.content.querySelectorAll('.topic-block:not(.topic-block-intro)')
			);

			return blocks.map(el => el.offsetTop - 146);
		},

		async _onScroll(scrollFlags) {
			if (scrollFlags.noSidebarActivity) {
				return;
			}

			await new Promise(resolve => this.$nextTick(resolve));

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
			let idx = (dir > 0) ? start + 1 : start;
			const end = (dir > 0) ? this.offsets.length : 0;

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
	padding-top: $header-height + 30px;

	.content {
		flex-grow: 1;
		padding: 0 30px 30px 30px;
	}
}
</style>
