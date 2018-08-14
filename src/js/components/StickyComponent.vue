<template>
	<div class="sticky-component">
		<div class="header-top">
			<div class="header-title-row">Encyclopadia Britannica</div>
			<hr />
			<div class="header-menu-row">
				<template v-for="(menuItem, idx) in menuItems">
					<span class="header-menu-item">
						<a :href="menuItem.href" class="header-menu-link" :class="`header-menu-link-${menuItem.copy}`">{{ menuItem.copy }}</a>
					</span>
					<span v-if="idx < menuItems.length - 1" class="header-menu-item header-menu-spacer">•</span>
				</template>
			</div>
		</div>

		<div class="header-bottom">
			<subheader-component :scrollY="scrollY" :topic="topic"></subheader-component>
		</div>

		<sidebar :scrollY="scrollY" :topic="topic"/>
	</div>
</template>

<script>
import SubheaderComponent from './SubheaderComponent.vue';
import Sidebar from './Sidebar.vue';

export default {
	props: ['scrollY', 'topic'],
	components: {
		SubheaderComponent,
		Sidebar
	},
	data() {
		return {
			menuItems: [
				{ copy: 'SPOTLIGHT', class: 'spotlight', href: '#spotlight' },
				{ copy: 'DEMYSTIFIED', class: 'demystified', href: '#demystified' },
				{ copy: 'QUIZZES', class: 'quizzes', href: '#quizzes' },
				{ copy: 'GALLERIES', class: 'galleries', href: '#galleries' },
				{ copy: 'LISTS', class: 'lists', href: '#lists' },
				{ copy: 'ON THIS DAY', class: 'on-this-day', href: '#on-this-day' },
				{ copy: 'BIOGRAPHIES', class: 'biographies', href: '#biographies' }
			]
		};
	},
	computed: {
		headerClass() {
			return this.scrollY >= 70 ? 'stuck' : '';
		}
	}
};
</script>

<style lang="scss" scoped>
$header-height: 109px;

.sticky-component {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.sticky-inner {
	position: relative;
	top: 0;

	.stuck & {
		top: -35px;
	}
}

.header-top {
	background: #084465;
	padding: 5px;
	color: white;

	.header-title-row, .header-menu-row {
		color: white;
	}

	.header-menu-row {
		.header-menu-item {
			margin-right: 5px;

			&.header-menu-spacer {
				margin-right: 6px;
			}

			.header-menu-link {
				color: white;
				text-decoration: none;

				&:hover {
					color: #19a4f4;
					cursor: pointer;
				}
			}
		}
	}
}
</style>
