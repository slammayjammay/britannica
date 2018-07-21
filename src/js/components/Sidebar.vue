<template>
	<div class="sidebar sidebar-width subheader-color">
		<ul>
			<sidebar-item :section="topic.intro" @sidebar-item-click="_onSidebarItemClick"/>
			<sidebar-item
				v-for="section in topic.sections"
				:key="section.header"
				:section="section"
				@sidebar-item-click="_onSidebarItemClick"
			/>
		</ul>
	</div>
</template>

<script>
import SidebarItem from './SidebarItem.vue';
import eventBus from '../utils/event-bus';
import smoothScroll from '../utils/smooth-scroll';

export default {
	props: ['scrollY', 'topic'],
	components: {
		SidebarItem
	},
	mounted() {
		this._onSidebarItemClick = this._onSidebarItemClick.bind(this);
		this._onActiveBlock = this._onActiveBlock.bind(this);

		this.activeItem = null;
		this.children = [];

		const pushChildren = (child) => {
			this.children.push(child);
			child.$children.forEach(pushChildren);
		};
		this.$children.forEach(pushChildren);

		eventBus.$on('sidebar-item-click', this._onSidebarItemClick);
		eventBus.$on('scroll-active-block', this._onActiveBlock);
	},
	methods: {
		_onSidebarItemClick(child, anchorTag) {
			const id = anchorTag.getAttribute('href').replace('#', '');
			smoothScroll(id);

			if (this.activeItem) {
				this.activeItem.setInactive();
			}

			this.activeItem = child;
			this.activeItem.setActive();
		},

		_onActiveBlock(idx) {
			if (this.activeItem) {
				this.activeItem.setInactive()
			}

			this.activeItem = this.children[idx];
			this.activeItem.setActive();
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../scss/_settings.scss';

.sidebar {
	height: 100%;

	ul {
		height: calc(100% - #{$header-height});
		overflow: scroll;
		padding: 10px;
		margin: 0;
		list-style-type: none;
	}
}
</style>
