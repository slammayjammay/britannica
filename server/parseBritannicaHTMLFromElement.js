const { JSDOM } = require('jsdom');
const escapeHTML = require('escape-html');

const { document } = new JSDOM().window;

/**
 * @param {JSDOMElement} elToParse - The element to parse.
 */
module.exports = (elToParse) => {
	const element = document.createElement('p');

	for (const childEl of elToParse.childNodes) {
		let newElement;

		if (childEl.tagName === 'A') {
			newElement = createAnchorElement(childEl);
		} else if (childEl.tagName === 'STRONG') {
			newElement = document.createElement('strong');
		} else if (childEl.tagName === 'em') {
			newElement = document.createElement('EM');
		} else {
			newElement = document.createTextNode('');
		}

		newElement.textContent = parseTextContent(childEl);

		element.appendChild(newElement);
	}

	return element.innerHTML;
};

function createAnchorElement(elToParse) {
	const anchor = document.createElement('a');
	anchor.textContent = parseTextContent(elToParse);

	const href = elToParse.getAttribute('href').replace('https://www.britannica.com', '');
	anchor.setAttribute('href', escapeHTML(href));

	return anchor;
}

function parseTextContent(elToParse) {
	if (elToParse.nodeName === '#text') {
		return elToParse.textContent;
	}

	let textContent = '';

	const traverse = (child) => {
		if (child.nodeName === '#text') {
			textContent += child.textContent;
		} else if (child.childNodes) {
			traverse(child.childNodes);
		}
	};

	elToParse.childNodes.forEach(traverse);

	return textContent;
}
