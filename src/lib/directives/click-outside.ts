export function clickoutside(node: HTMLElement, fn: () => void) {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node)) {
			fn();
		}
	};

	document.addEventListener('click', handleClick);

	return {
		destroy() {
			document.removeEventListener('click', handleClick);
		}
	};
}
