const { JSDOM } = require('jsdom');
const escapeHTML = require('escape-html');

const { document } = new JSDOM().window;

/**
 * @param {JSDOMElement} elToParse - The element to parse.
 */
module.exports = (elToParse) => {
	const dummy = document.createElement('div');

	if (['P', 'LI', 'DD'].includes(elToParse.tagName)) {
		parseParagraph(elToParse, dummy);
		return dummy.innerHTML;
	}

	let newElement;

	if (elToParse.tagName === 'IMG') {
		newElement = document.createElement('img');
		setupImgElement(elToParse, newElement);
	}

	dummy.appendChild(newElement);

	return dummy.innerHTML;
};

function parseParagraph(elToParse, dummy) {
	for (const childEl of elToParse.childNodes) {
		let newElement;

		if (childEl.nodeName === '#text') {
			newElement = document.createTextNode('');
		} else if (['A', 'STRONG', 'EM', 'SPAN'].includes(childEl.tagName)) {
			newElement = document.createElement(childEl.tagName);

			if (childEl.tagName === 'A') {
				setupAnchorElement(childEl, newElement);
			}
		}

		newElement.textContent = parseTextContent(childEl);

		dummy.appendChild(newElement);
	}
}

function setupAnchorElement(elToParse, elToCreate) {
	const href = elToParse.getAttribute('href').replace('https://www.britannica.com', '');
	elToCreate.setAttribute('href', escapeHTML(href));
}

function setupImgElement(elToParse, elToCreate) {
	const src = elToParse.getAttribute('src');
	elToCreate.setAttribute('src', escapeHTML(src));
}

function parseTextContent(elToParse) {
	if (elToParse.nodeName === '#text') {
		return elToParse.textContent;
	}

	let textContent = '';

	const traverse = (child) => {
		if (child.nodeName === '#text' || child.tagName === 'A') {
			textContent += child.textContent;
		} else if (child.childNodes) {
			traverse(child.childNodes);
		}
	};

	elToParse.childNodes.forEach(traverse);

	return textContent;
}
