<template>
	<div class="sticky-component">
		<div class="header-top">
			<div class="header-top-row">
				<div class="header-title-row">Encyclopadia Britannica</div>
				<hr />
			</div>
			<div class="header-menu-row">
				<span class="header-menu-item header-menu-item-hamburger">
					<button class="hamburger-button button-reset">
						<div class="ham ham-1"></div>
						<div class="ham ham-2"></div>
						<div class="ham ham-3"></div>
					</button>
				</span>

				<template v-for="(menuItem, idx) in menuItems">
					<span class="header-menu-item no-mobile">
						<a :href="menuItem.href" class="header-menu-link" :class="`header-menu-link-${menuItem.copy}`">{{ menuItem.copy }}</a>
						<span v-if="idx < menuItems.length - 1" class="header-menu-spacer">•</span>
					</span>
				</template>

				<header-search-component class="header-menu-item"/>
			</div>
		</div>

		<div class="header-bottom">
			<subheader-component :scrollY="scrollY" :topic="topic"/>
		</div>

		<search-modal-component/>

		<sidebar :scrollY="scrollY" :topic="topic"/>
	</div>
</template>

<script>
import SubheaderComponent from './SubheaderComponent.vue';
import HeaderSearchComponent from './HeaderSearchComponent.vue';
import SearchModalComponent from './SearchModalComponent.vue';
import Sidebar from './Sidebar.vue';

export default {
	props: ['scrollY', 'topic'],
	components: {
		SubheaderComponent,
		HeaderSearchComponent,
		SearchModalComponent,
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
.sticky-component {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
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
	padding: 5px 15px 0;
	color: white;

	.header-title-row, .header-menu-row {
		color: white;
	}

	hr {
		margin-bottom: 0;
	}

	.header-top-row {
		@include screen-max-width($header-mobile-width-break) {
			display: none;
		}
	}

	.header-menu-row {
		.header-menu-item {
			margin-right: 5px;
			display: inline-block;
			padding-top: 10px;
			padding-bottom: 10px;

			&.no-mobile {
				@include screen-max-width($header-mobile-width-break) {
					display: none;
				}
			}

			&.header-menu-item-hamburger {
				@include screen-min-width($header-mobile-width-break) {
					display: none;
				}

				.hamburger-button {
					position: relative;
					width: 20px;
					height: 14px;

					&:hover {
						cursor: pointer;

						.ham {
							background: #cfdae0;
						}
					}

					.ham {
						position: absolute;
						left: 0;
						width: 100%;
						height: 2px;
						background: white;

						&-1 { top: 0; }
						&-2 { top: 0; bottom: 0; margin: auto; }
						&-3 { bottom: 0; }
					}
				}
			}

			.header-menu-spacer {
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
