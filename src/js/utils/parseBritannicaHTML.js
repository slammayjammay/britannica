import parse5 from 'parse5';
import escapeHTML from 'escape-html';

/**
 * Expects the innerHTML from a <p> tag on the britannica site. At first glance,
 * it looks like it's only one level deep -- the children elements of the
 * paragraph do not contain any child elements (other than text nodes).
 *
 * @param {string} paragraphHTML - The innerHTML of a <p> tag from the britannica site.
 */
export default (paragraphHTML, flag) => {
	const fragment = parse5.parseFragment(paragraphHTML);
	const element = document.createElement('p');

	for (const childEl of fragment.childNodes) {
		let parsedElement;

		if (childEl.tagName === 'a') {
			parsedElement = createAnchorElement(childEl);
		} else if (childEl.tagName === 'strong') {
			parsedElement = document.createElement('strong');
		} else if (childEl.tagName === 'em') {
			parsedElement = document.createElement('em');
		} else {
			parsedElement = document.createTextNode('');
		}

		parsedElement.textContent = parseTextContent(childEl);

		element.appendChild(parsedElement);
	}

	return element.innerHTML;
};

function createAnchorElement(el) {
	const anchor = document.createElement('a');
	anchor.textContent = parseTextContent(el);

	const href = (() => {
		for (const attr of el.attrs) {
			if (attr.name === 'href') {
				return attr.value.replace('https://www.britannica.com', '');
			}
		}
	})();

	anchor.setAttribute('href', escapeHTML(href));
	return anchor;
}

function parseTextContent(el) {
	if (el.nodeName === '#text') {
		return el.value;
	}

	let textContent = '';

	const traverse = (child) => {
		if (child.nodeName === '#text') {
			textContent += child.value;
		} else if (child.childNodes) {
			traverse(child.childNodes);
		}
	};

	el.childNodes.forEach(traverse);

	return textContent;
}
