<template>
  <div class="breakpoint"></div>
</template>

<script>
import eventBus from '../utils/event-bus';

export default {
  mounted() {
		this._currentBreakpoint = null;

		eventBus.$on('resize', () => {
			const newBreakpoint = getComputedStyle(this.$el).content.replace(/"/g, '');

			if (newBreakpoint === this._currentBreakpoint) {
				return;
			}

			eventBus.$emit('breakpoint', newBreakpoint, this._currentBreakpoint);

			this._currentBreakpoint = newBreakpoint;
		});
  }
};
</script>

<style lang="scss" scoped>
.breakpoint {
  visibility: hidden;
  position: absolute;
  width: 0;
  height: 0;

  @include viewport(large) {
    content: 'large';
  }
  @include viewport(medium) {
    content: 'medium';
  }
  @include viewport(small) {
    content: 'small';
  }
}
</style>
