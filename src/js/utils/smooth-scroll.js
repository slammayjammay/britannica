import eventBus from './event-bus';

const DEFAULT_OPTIONS = {
	duration: 0.4,
	offsetFromTop: 0
};

/**
 * @param {string} id - The id of the element to scroll to.
 * @param {number} offsetFromTop - "Padding" between the element and the viewport.
 */
export default (id, options = {}) => {
	options = Object.assign({}, DEFAULT_OPTIONS, options);

	const el = document.getElementById(id);

	el.setAttribute('id', `${id}thisisasillyhack${id}`);
	location.hash = id;
	el.setAttribute('id', id);

	const currentY = window.scrollY;

	let targetY = ~~(currentY + el.getBoundingClientRect().top - options.offsetFromTop);
	targetY = Math.max(0, targetY);
	targetY = Math.min(document.body.offsetHeight - window.innerHeight, targetY);

	if (currentY === targetY) {
		return;
	}

	const dir = (targetY > currentY) ? 1 : -1;

	const startTime = new Date();
	let timeoutId;

	function scroll(a) {
		const elapsedTime = Math.min(1, (new Date() - startTime) / (options.duration * 1000));
		const currentVal = easeInOutCubic(elapsedTime);

		const scrollPos = currentY + (targetY - currentY) * currentVal;
		window.scrollTo(0, scrollPos);

		if (scrollPos === targetY) {
			cancelAnimationFrame(timeoutId);
			eventBus.$emit('smoothscroll-end')
		} else {
			timeoutId = requestAnimationFrame(scroll);
		}
	}

	eventBus.$emit('smoothscroll-begin');
	scroll();
};

function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}
