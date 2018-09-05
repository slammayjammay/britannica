const { JSDOM } = require('jsdom');
const escapeHTML = require('escape-html');

const { document } = new JSDOM().window;

/**
 * @param {JSDOMElement} elToParse - The element to parse.
 */
module.exports = (elToParse) => {
	const dummy = document.createElement('div');

	if (['DIV', 'P', 'LI', 'DD'].includes(elToParse.tagName)) {
		// assume this element holds only text
		parseParagraph(elToParse, dummy);
	} else if (elToParse.tagName === 'IMG') {
		const newElement = document.createElement('img');
		setupImgElement(elToParse, newElement);
		dummy.appendChild(newElement);
	}

	return {
		tagName: elToParse.tagName,
		html: dummy.innerHTML
	};
};

function parseParagraph(elToParse, dummy) {
	for (const childEl of elToParse.childNodes) {
		let newElement;

		if (childEl.nodeName === '#text') {
			newElement = document.createTextNode('');
		} else if (['A', 'STRONG', 'EM', 'SPAN', 'SUP'].includes(childEl.tagName)) {
			newElement = document.createElement(childEl.tagName);

			if (childEl.tagName === 'A') {
				setupAnchorElement(childEl, newElement);
			}
		} else {
			console.log(`SERVER WARNING: unaccounted for element "${childEl.tagName}".`);
			newElement = document.createTextNode('');
		}

		newElement.textContent = parseTextContent(childEl);

		dummy.appendChild(newElement);
	}
}

function setupAnchorElement(elToParse, elToSetup) {
	const href = elToParse.getAttribute('href').replace('https://www.britannica.com', '');
	elToSetup.setAttribute('href', escapeHTML(href));

	if (href.includes('https://www.merriam-webster.com/dictionary/')) {
		elToSetup.setAttribute('data-dictionary-link-target', parseTextContent(elToParse));
	}
}

function setupImgElement(elToParse, elToSetup) {
	const src = elToParse.getAttribute('src');
	elToSetup.setAttribute('src', escapeHTML(src));
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
