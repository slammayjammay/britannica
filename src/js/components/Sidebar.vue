<template>
	<div class="sidebar sidebar-width subheader-color" :class="sidebarClass">
		<ul>
			<sidebar-item
				:section="topic.intro"
				@sidebar-item-click="_onSidebarItemClick"
			/>

			<sidebar-item
				v-for="section in topic.sections"
				:key="section.id"
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
	data() {
		return {
			isCollapsed: false
		};
	},
	computed: {
		sidebarClass() {
			return {
				'collapsed': this.isCollapsed
			};
		}
	},
	mounted() {
		this._onSidebarItemClick = this._onSidebarItemClick.bind(this);
		this._onActiveBlock = this._onActiveBlock.bind(this);

		this.activeItem = null;
		this.sidebarItems = [];

		const pushChildren = (child) => {
			this.sidebarItems.push(child);
			child.$children.forEach(pushChildren);
		};
		this.$children.forEach(pushChildren);

		eventBus.$on('sidebar-item-click', this._onSidebarItemClick);
		eventBus.$on('scroll-active-block', this._onActiveBlock);
		eventBus.$on('sidebar-collapse', () => this.isCollapsed = true);
		eventBus.$on('sidebar-open', () => this.isCollapsed = false);
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

			this.activeItem = this.sidebarItems[idx];
			this.activeItem.setActive();
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../scss/_settings.scss';

.sidebar {
	position: absolute;
	height: 100vh;
	overflow: scroll;

	&.collapsed {
		display: none;
	}

	ul {
		height: calc(100% - #{$header-height});
		overflow: scroll;
		padding: 10px;
		margin: 0;
		list-style-type: none;
	}
}
</style>
