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
	const targetY = currentY + el.getBoundingClientRect().top - options.offsetFromTop;

	if (currentY === targetY) {
		return;
	}

	const startTime = new Date();
	let timeoutId;

	function scroll() {
		const elapsedTime = new Date() - startTime;
		const scrollPos = easeInOutCubic(elapsedTime, currentY, targetY - currentY, options.duration * 1000);
		window.scrollTo(0, scrollPos);
		timeoutId = requestAnimationFrame(scroll);
	}

	eventBus.$emit('smoothscroll-begin');
	scroll();

	setTimeout(() => {
		cancelAnimationFrame(timeoutId);
		eventBus.$emit('smoothscroll-end')
	}, options.duration * 1000);
};

function easeInOutCubic(time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time * time + begin;
	}
	return change / 2 * ((time -= 2) * time * time + 2) + begin;
};
