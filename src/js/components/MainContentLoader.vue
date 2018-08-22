<template>
	<div class="main-content-loader">
		<h1>
			<span v-for="(char, idx) in 'Loading...'" class="char" :class="'char-' + idx">{{ char }}</span>
		</h1>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" >
.main-content-loader {
	@keyframes bump {
		0% {
			transform: translateY(0);
		}

		15% {
			transform: translateY(-10px);
		}

		30% {
			transform: translateY(0);
		}
	}

	.char {
		animation: bump 1s infinite;
		display: inline-block;

		@for $i from 0 through str-length('loading...') {
			&.char-#{$i} {
				animation-delay: $i * 0.05s;
			}
		}
	}
}
</style>
