<template>
	<li class="sidebar-item" :class="sidebarClass">
		<a v-if="section.id" ref="anchor" class="anchor" :href="`#${section.id}`" @click="onClick">
			{{ section.sidebarHeader || section.header }}
		</a>
		<span v-else class="anchor anchor-fake">
			{{ section.sidebarHeader || section.header }}
		</span>
		<ul>
			<sidebar-item
				v-for="section in section.sections"
				:key="section.id"
				:level="level + 1"
				:section="section"
				@sidebar-item-click="onClick"
			/>
		</ul>
	</li>
</template>

<script>
import eventBus from '../utils/event-bus';

export default {
	name: 'sidebar-item',
	props: {
		level: { type: Number, default: 0 },
		section: { type: Object }
	},
	data() {
		return {
			active: false
		};
	},
	computed: {
		sidebarClass() {
			const classes = [];

			classes.push(`sidebar-item-level-${this.level}`);

			if (this.active) {
				classes.push('active');
			}

			if (!this.section.isFilled) {
				classes.push('disabled');
			}

			return classes.join(' ');
		}
	},
	methods: {
		onClick(e) {
			e.preventDefault();

			if (this.section.isFilled) {
				eventBus.$emit('sidebar-item-click', this, this.$refs.anchor);
			}
		},

		setActive() {
			this.active = true;
		},

		setInactive() {
			this.active = false;
		}
	}
};
</script>

<style lang="scss" scoped>
li.sidebar-item {
	list-style-type: none;

	.anchor {
		display: block;
		padding: 5px;
		text-decoration: none;
		color: #126596;

		&:hover, &-fake {
			background: #e6e6e6;
		}
	}

	&.disabled {
		a {
			color: gray;
		}
	}

	&.active > .anchor {
		background: #999;
		color: white;
	}

	ul {
		padding-left: 20px;
		margin: 0;
	}
}
</style>
