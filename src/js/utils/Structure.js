class Structure {
	/**
	 * @param {object} intro - The first section in the sidebar.
	 * @param {array} sections - The remaining sections in the sidebar.
	 */
	constructor(intro, sections, facts) {
		this.intro = intro;
		this.facts = facts;

		this.nodeMap = {};
		this.tree = this.createTree(sections);
	}

	createTree(sections) {
		const tree = { sections: [] };

		let nodesPath = [];
		let lastNode;
		let lastLevel = -1;

		for (let i = 0; i < sections.length; i++) {
			const { level, id, sidebarHeader, header } = sections[i];

			if (level === 1) {
				nodesPath = [tree];
			} else if (level > lastLevel) {
				nodesPath.push(lastNode);
			} else if (level < lastLevel) {
				const diff = lastLevel - level;
				nodesPath.splice(nodesPath.length - diff, diff);
			}

			const parentNode = nodesPath[nodesPath.length - 1];
		 	const newNode = {
				level,
				id,
				sidebarHeader,
				header,
				elements: [],
				sections: [],
				isFilled: false
			};

			parentNode.sections.push(newNode);
			this.nodeMap[id] = newNode;

			lastNode = newNode;
			lastLevel = level;
		}

		return tree;
	}

	fillIntro(intro) {
		this.intro.header = intro.header;
		this.intro.elements = intro.elements;
		this.intro.writtenBy = intro.writtenBy;
		this.intro.isFilled = true;
	}

	fill(sections) {
		for (let section of sections) {
			const node = this.nodeMap[section.id];

			node.header = section.header;
			node.elements = section.elements;

			node.isFilled = true;
		}
	}

	traverseDFS(callback) {
		const traverse = (node) => {
			callback(node);
			node.sections.forEach(node => traverse(node));
		};

		this.tree.sections.forEach(node => traverse(node));
	}

	toString() {
		let string = '';

		const nodeToString = ({ level, header }) => {
			let string = '';
			string += new Array(level).join('\t');
			string += header;
			string += '\n';
			return string;
		};

		this.traverseDFS(node => string += nodeToString(node));

		return string;
	}
}

export default Structure;
